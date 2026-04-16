import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, User } from 'lucide-react'
import { getProfile, getLastAnalysis } from '../data/store'

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hello! I'm your Genesis AI assistant. Ask me anything about career paths, domains, or how to navigate the platform!" }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef(null)
  
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const isDragging = useRef(false)
  const dragOffset = useRef({ x: 0, y: 0 })
  const dragStartData = useRef({ x: 0, y: 0, time: 0 })

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  useEffect(() => {
    function handleMouseMove(e) {
      if (!isDragging.current) return
      
      const newX = e.clientX - dragOffset.current.x
      const newY = e.clientY - dragOffset.current.y
      
      const minX = -window.innerWidth + 100
      const maxX = 24
      const minY = -window.innerHeight + 160
      const maxY = 24

      setPosition({
        x: Math.max(minX, Math.min(newX, maxX)),
        y: Math.max(minY, Math.min(newY, maxY))
      })
    }
    function handleMouseUp() {
      if (isDragging.current) {
        setTimeout(() => { isDragging.current = false }, 0)
      }
      document.body.style.userSelect = 'auto'
    }
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  async function handleSend() {
    if (!input.trim() || isTyping) return
    
    const userMsg = { role: 'user', text: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    setMessages(prev => [...prev, { role: 'ai', text: '' }])

    try {
      const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
      const profile = await getProfile();
      const analysis = getLastAnalysis();

      const systemPrompt = `You are the Genesis Senior Career Navigator. Genesis is a professional platform for B.Tech and MBA students to bridge the gap between education and career domains.

Your Goal: Assist users with career guidance and help them navigate Genesis features.

Detailed Features Knowledge:
- HOME FEED: User-generated career tips and domain insights.
- NETWORK: Find and connect with peers and mentors. Guide users here to "Connect" with others.
- EXPLORE: Real-time market data, salary ranges (Freshers vs Mid-level), and demand trends.
- COMMUNITIES: Specialized groups (e.g., Programming, Data AI, FinTech).
- CAREER ADVISOR: Our "Smart Career Matcher" quiz that analyzes skills/interests to recommend domains.
- POSTING: Click the "Pen Square" icon in the Top Navigation bar to share insights or ask questions.
- MESSAGING: Use the Message icon in the navbar to chat with your network.

User Context:
- Current User: ${profile?.name || 'Guest'}
- Profile Path: ${profile?.path || 'Not set'}
- Recent Career Analysis: ${analysis ? JSON.stringify(analysis.top3.map(t => t.name)) : 'No analysis done yet.'}

Guidelines:
1. Be specific. If a user asks "How do I post?", tell them to look for the Pen Square icon in the top right.
2. If the user has a Career Analysis result, use it to suggest specific Communities or Network domains.
3. Keep responses professional, helpful, and concise. 
4. Do NOT discuss topics outside of career development or Genesis features.`;

      const response = await fetch('/api/openrouter/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': window.location.href,
          'X-Title': 'Genesis App',
          'Accept': 'text/event-stream'
        },
        body: JSON.stringify({
          model: "minimax/minimax-m2.7",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: input }
          ],
          stream: true,
          temperature: 1,
          top_p: 0.95,
          max_tokens: 4096
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error?.message || `HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          const trimmedLine = line.trim();
          if (trimmedLine.startsWith('data: ') && trimmedLine !== 'data: [DONE]') {
            try {
              const data = JSON.parse(trimmedLine.substring(6));
              const delta = data.choices[0].delta;

              if (delta.content) {
                fullText += delta.content;
                // Filter out <think>...</think> blocks, including unfinished ones
                const cleanText = fullText.replace(/<think>[\s\S]*?(?:<\/think>|$)/g, '').trim();
                
                setMessages(prev => {
                  const next = [...prev];
                  next[next.length - 1] = { ...next[next.length - 1], text: cleanText };
                  return next;
                });
              }
            } catch (e) {
              // Ignore partial JSON chunks
            }
          }
        }
      }
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => {
        const next = [...prev];
        next[next.length - 1] = { 
          ...next[next.length - 1], 
          text: "Sorry, I encountered an error connecting to the Genesis AI. Please try again later." 
        };
        return next;
      });
    } finally {
      setIsTyping(false)
    }
  }

  function handleMouseDown(e) {
    isDragging.current = true
    document.body.style.userSelect = 'none'
    dragStartData.current = { x: e.clientX, y: e.clientY, time: Date.now() }
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    }
  }

  function handleButtonClick(e) {
    const dx = Math.abs(e.clientX - dragStartData.current.x)
    const dy = Math.abs(e.clientY - dragStartData.current.y)
    const dt = Date.now() - dragStartData.current.time
    
    if (dx > 5 || dy > 5 || dt > 300) {
      e.preventDefault()
      e.stopPropagation()
      return
    }
    setIsOpen(!isOpen)
  }

  const isTopHalf = typeof window !== 'undefined' ? position.y < -(window.innerHeight / 2) : false

  return (
    <div style={{ 
      position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 1000, 
      display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
      transform: `translate(${position.x}px, ${position.y}px)`,
      transition: isDragging.current ? 'none' : 'transform 0.1s ease-out'
    }}>
      {isOpen && (
        <div className="glass" style={{ 
          position: 'absolute',
          bottom: isTopHalf ? 'auto' : 'calc(100% + 1rem)',
          top: isTopHalf ? 'calc(100% + 1rem)' : 'auto',
          right: 0,
          width: '320px', height: '420px', borderRadius: '1.25rem',
          display: 'flex', flexDirection: 'column', overflow: 'hidden', 
          boxShadow: '0 10px 40px rgba(0,0,0,0.5)', animation: 'slideInUp 0.3s forwards' 
        }}>
          <div 
            onMouseDown={handleMouseDown}
            style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'grab' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', pointerEvents: 'none' }}>
              <div style={{ padding: '0.4rem', background: 'rgba(45,212,191,0.15)', borderRadius: '0.5rem', color: 'var(--teal-400)' }}>
                <Bot size={18} />
              </div>
              <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Genesis AI</span>
            </div>
            <button 
              onMouseDown={e => e.stopPropagation()} 
              onClick={() => setIsOpen(false)} 
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
          </div>

          <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }} className="custom-scroll">
            {messages.map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'chat-msg-user' : 'chat-msg-ai'} style={{ 
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                padding: '0.6rem 0.9rem',
                borderRadius: m.role === 'user' ? '1rem 1rem 0 1rem' : '1rem 1rem 1rem 0',
                fontSize: '0.875rem',
                lineHeight: 1.5,
                position: 'relative'
              }}>
                {m.text || <span style={{ opacity: 0.5 }}>...</span>}
              </div>
            ))}
            {isTyping && (
              <div className="chat-msg-ai" style={{ alignSelf: 'flex-start', padding: '0.6rem 0.9rem', borderRadius: '1rem 1rem 1rem 0', display: 'flex', gap: '0.2rem', alignItems: 'center' }}>
                <div style={{ width: '4px', height: '4px', background: '#94a3b8', borderRadius: '50%', animation: 'pulse 1s infinite' }} />
                <div style={{ width: '4px', height: '4px', background: '#94a3b8', borderRadius: '50%', animation: 'pulse 1s infinite 0.2s' }} />
                <div style={{ width: '4px', height: '4px', background: '#94a3b8', borderRadius: '50%', animation: 'pulse 1s infinite 0.4s' }} />
              </div>
            )}
          </div>

          <div style={{ padding: '0.8rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '0.5rem' }}>
            <input 
              className="inp"
              style={{ flex: 1, fontSize: '0.85rem', padding: '0.5rem 0.8rem' }}
              placeholder="Type a message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend} style={{ background: 'var(--teal-500)', border: 'none', borderRadius: '0.5rem', color: '#000', padding: '0.5rem 0.8rem', cursor: 'pointer' }}>
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      <button 
        onMouseDown={handleMouseDown}
        onClick={handleButtonClick}
        className="glass"
        style={{ 
          width: '56px', height: '56px', borderRadius: '50%', border: 'none', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', 
          color: 'var(--teal-400)', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        {isOpen ? <X size={24} /> : <Bot size={28} />}
      </button>

      <style>{`
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
