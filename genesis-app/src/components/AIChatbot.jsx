import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, User } from 'lucide-react'

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hello! I'm your Genesis AI assistant. Ask me anything about career paths, domains, or how to navigate the platform!" }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  function handleSend() {
    if (!input.trim()) return
    const userMsg = { role: 'user', text: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      let aiText = "That's a great question! Based on your profile, you might want to explore the B.Tech → CSE domain for more opportunities."
      if (input.toLowerCase().includes('hello') || input.toLowerCase().includes('hi')) {
        aiText = "Hi there! How can I assist with your career discovery today?"
      } else if (input.toLowerCase().includes('help')) {
        aiText = "I can help you navigate domains, connect with mentors in the Network tab, or explain how to post your journey!"
      } else if (input.toLowerCase().includes('who are you')) {
        aiText = "I am the Genesis AI, designed to help students and professionals find their ideal technical path."
      }
      
      setMessages(prev => [...prev, { role: 'ai', text: aiText }])
      setIsTyping(false)
    }, 1200)
  }

  return (
    <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
      {/* Chat Window */}
      {isOpen && (
        <div className="glass" style={{ 
          width: '320px', height: '420px', borderRadius: '1.25rem', marginBottom: '1rem', 
          display: 'flex', flexDirection: 'column', overflow: 'hidden', 
          boxShadow: '0 10px 40px rgba(0,0,0,0.5)', animation: 'slideInUp 0.3s forwards' 
        }}>
          {/* Header */}
          <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ padding: '0.4rem', background: 'rgba(45,212,191,0.15)', borderRadius: '0.5rem', color: 'var(--teal-400)' }}>
                <Bot size={18} />
              </div>
              <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Genesis AI</span>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }} className="custom-scroll">
            {messages.map((m, i) => (
              <div key={i} style={{ 
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                padding: '0.6rem 0.9rem',
                borderRadius: m.role === 'user' ? '1rem 1rem 0 1rem' : '1rem 1rem 1rem 0',
                background: m.role === 'user' ? 'var(--teal-500)' : 'rgba(255,255,255,0.08)',
                color: m.role === 'user' ? '#000' : '#f8fafc',
                fontSize: '0.875rem',
                lineHeight: 1.5,
                position: 'relative'
              }}>
                {m.text}
              </div>
            ))}
            {isTyping && (
              <div style={{ alignSelf: 'flex-start', padding: '0.6rem 0.9rem', borderRadius: '1rem 1rem 1rem 0', background: 'rgba(255,255,255,0.08)', display: 'flex', gap: '0.2rem', alignItems: 'center' }}>
                <div style={{ width: '4px', height: '4px', background: '#94a3b8', borderRadius: '50%', animation: 'pulse 1s infinite' }} />
                <div style={{ width: '4px', height: '4px', background: '#94a3b8', borderRadius: '50%', animation: 'pulse 1s infinite 0.2s' }} />
                <div style={{ width: '4px', height: '4px', background: '#94a3b8', borderRadius: '50%', animation: 'pulse 1s infinite 0.4s' }} />
              </div>
            )}
          </div>

          {/* Input */}
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

      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
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
