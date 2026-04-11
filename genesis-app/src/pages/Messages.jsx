import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getConversations, saveConversations, getNetwork } from '../data/store';
import { Send, ArrowLeft, Search, User } from 'lucide-react';

export default function Messages() {
  const [conversations, setConversations] = useState(getConversations());
  const [activeChatId, setActiveChatId] = useState(null);
  const [inputText, setInputText] = useState('');
  const [search, setSearch] = useState('');
  
  const location = useLocation();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (location.state && location.state.contactId) {
      const contactId = location.state.contactId;
      let chat = conversations.find(c => c.contactId === contactId);
      if (!chat) {
        const net = getNetwork();
        const person = net.find(n => n.id === contactId);
        if (person) {
          chat = { id: Date.now(), contactId, contactName: person.name, avatar: null, unread: 0, messages: [] };
          const newConvos = [chat, ...conversations];
          setConversations(newConvos);
          saveConversations(newConvos);
        }
      }
      if (chat) setActiveChatId(chat.id);
      navigate('/messages', { replace: true, state: {} });
    } else if (!activeChatId && conversations.length > 0) {
      setActiveChatId(conversations[0].id);
    }
  }, [location, conversations, navigate, activeChatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations, activeChatId]);

  const activeChat = conversations.find(c => c.id === activeChatId);

  function handleSend(e) {
    e.preventDefault();
    if (!inputText.trim() || !activeChat) return;

    const newMessage = { 
      id: Date.now(), 
      sender: 'me', 
      text: inputText.trim(), 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };

    const updatedConversations = conversations.map(c => 
      c.id === activeChatId 
        ? { ...c, messages: [...c.messages, newMessage] } 
        : c
    );

    setConversations(updatedConversations);
    saveConversations(updatedConversations);
    setInputText('');
  }

  const filteredConversations = conversations.filter(c => 
    c.contactName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem', paddingTop: '5rem', height: 'calc(100vh - 64px)', display: 'flex', gap: '1rem' }}>
      
      {/* Left Pane - Chat List */}
      <div className={`glass fade-in-up ${activeChatId ? 'hide-mobile' : ''}`} style={{ width: '350px', borderRadius: '1rem', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 1rem' }}>Messages</h2>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
            <input 
              className="inp" 
              placeholder="Search messages..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: '2.2rem', paddingRight: '1rem', paddingTop: '0.5rem', paddingBottom: '0.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '99px', fontSize: '0.85rem', width: '100%', boxSizing: 'border-box' }} 
            />
          </div>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filteredConversations.length === 0 ? (
             <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--slate-400)', fontSize: '0.9rem' }}>No conversations found.</div>
          ) : (
            filteredConversations.map(c => {
              const lastMsg = c.messages[c.messages.length - 1];
              const isActive = c.id === activeChatId;
              const initials = c.contactName.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase();
              return (
                <div 
                  key={c.id} 
                  onClick={() => setActiveChatId(c.id)}
                  style={{ 
                    padding: '1rem', 
                    display: 'flex', 
                    gap: '1rem', 
                    cursor: 'pointer', 
                    background: isActive ? 'rgba(255,255,255,0.05)' : 'transparent',
                    borderLeft: isActive ? '3px solid var(--teal-400)' : '3px solid transparent',
                    transition: 'all 0.2s'
                  }}
                  className="hover-bg"
                >
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--teal-500), var(--violet-500))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#fff', flexShrink: 0 }}>
                    {initials}
                  </div>
                  <div style={{ overflow: 'hidden', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{c.contactName}</span>
                      {lastMsg && <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>{lastMsg.time}</span>}
                    </div>
                    {lastMsg && (
                      <div style={{ fontSize: '0.85rem', color: 'var(--slate-400)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {lastMsg.sender === 'me' ? 'You: ' : ''}{lastMsg.text}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Pane - Active Chat */}
      <div className={`glass fade-in-up ${!activeChatId ? 'hide-mobile' : ''}`} style={{ flex: 1, borderRadius: '1rem', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button 
                className="icon-btn show-only-mobile" 
                onClick={() => setActiveChatId(null)}
                style={{ marginRight: '-0.5rem' }}
              >
                <ArrowLeft size={20} />
              </button>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--teal-500), var(--violet-500))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#fff' }}>
                {activeChat.contactName.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()}
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>{activeChat.contactName}</h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--teal-400)' }}>Online</div>
              </div>
            </div>

            {/* Chat Messages */}
            <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {activeChat.messages.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--slate-400)', margin: 'auto' }}>Say hi to {activeChat.contactName}!</div>
              ) : (
                activeChat.messages.map(msg => {
                  const isMe = msg.sender === 'me';
                  return (
                    <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                      <div style={{ 
                        maxWidth: '75%', 
                        padding: '0.75rem 1rem', 
                        borderRadius: '1rem', 
                        borderBottomRightRadius: isMe ? '0.2rem' : '1rem',
                        borderBottomLeftRadius: !isMe ? '0.2rem' : '1rem',
                        background: isMe ? 'var(--teal-500)' : 'rgba(255,255,255,0.08)',
                        color: isMe ? '#000' : 'inherit',
                        fontWeight: isMe ? 500 : 400
                      }}>
                        {msg.text}
                      </div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--slate-400)', marginTop: '0.3rem', padding: '0 0.5rem' }}>{msg.time}</span>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSend} style={{ padding: '1rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '0.75rem' }}>
              <input 
                className="inp" 
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder="Type a message..." 
                style={{ flex: 1, background: 'rgba(255,255,255,0.03)', borderRadius: '99px', padding: '0.75rem 1.25rem', border: 'none', color: 'inherit', outline: 'none' }} 
              />
              <button 
                type="submit" 
                style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'var(--teal-500)', color: '#000', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, opacity: inputText.trim() ? 1 : 0.6 }}
                disabled={!inputText.trim()}
              >
                <Send size={18} style={{ marginLeft: '-2px' }} />
              </button>
            </form>
          </>
        ) : (
          <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--slate-400)' }}>
            <User size={48} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
            <h3 style={{ fontSize: '1.2rem', color: 'var(--slate-300)', marginBottom: '0.5rem' }}>Your Messages</h3>
            <p style={{ fontSize: '0.9rem' }}>Select a conversation or start a new one to chat.</p>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
          .show-only-mobile { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
