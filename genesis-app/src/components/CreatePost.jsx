import { useState, useRef } from 'react'
import { Image, Link, Compass, X } from 'lucide-react'
import { showToast } from './Toast'

const DOMAINS = ['B.Tech → CSE', 'B.Tech → Mech', 'B.Tech → Civil', 'MBA → Marketing', 'MBA → Finance', 'General']

export default function CreatePost({ profile, onPublish }) {
  const [content, setContent] = useState('')
  const [domain, setDomain] = useState('General')
  const [imgSrc, setImgSrc] = useState(null)
  const [showDomains, setShowDomains] = useState(false)
  const [focused, setFocused] = useState(true)
  const fileRef = useRef()

  function publish() {
    if (!content.trim()) { showToast('Write something first!', 'error'); return }
    onPublish({ content, domain, imgSrc })
    setContent('')
    setImgSrc(null)
    setShowDomains(false)
    setFocused(false)
    showToast('Post published! 🚀')
  }

  function handleImg(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setImgSrc(ev.target.result)
    reader.readAsDataURL(file)
  }

  const initials = (profile?.name || 'Alex Dev').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div className="glass" style={{ borderRadius: '1rem', padding: '1.25rem' }}>
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
        <div style={{
          width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, var(--teal-400), var(--violet-500))',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem', color: '#fff'
        }}>{initials}</div>

        <div style={{ flex: 1 }}>
          <textarea
            rows={focused ? 4 : 2}
            style={{
              width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '0.75rem', padding: '0.75rem 1rem', resize: 'none', outline: 'none',
              color: 'inherit', fontFamily: 'inherit', fontSize: '0.95rem',
              transition: 'all 0.3s', boxSizing: 'border-box'
            }}
            placeholder={`What's on your mind, ${(profile?.name || 'Alex').split(' ')[0]}?`}
            value={content}
            onChange={e => setContent(e.target.value)}
            onFocus={() => setFocused(true)}
          />

          {/* Attached image preview */}
          {imgSrc && (
            <div style={{ position: 'relative', marginTop: '0.5rem', borderRadius: '0.75rem', overflow: 'hidden', maxHeight: '180px' }}>
              <img src={imgSrc} alt="preview" style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
              <button onClick={() => setImgSrc(null)} style={{
                position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.6)',
                border: 'none', borderRadius: '50%', color: '#fff', cursor: 'pointer', padding: '4px', display: 'flex'
              }}><X size={14} /></button>
            </div>
          )}

          {/* Domain picker */}
          {showDomains && (
            <div style={{ marginTop: '0.5rem', padding: '0.75rem', background: 'rgba(255,255,255,0.04)', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Select Domain Tag:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {DOMAINS.map(d => (
                  <span key={d} onClick={() => { setDomain(d); setShowDomains(false); showToast(`Domain: ${d}`) }}
                    style={{
                      padding: '0.2rem 0.75rem', borderRadius: '999px', fontSize: '0.78rem', cursor: 'pointer',
                      background: domain === d ? 'rgba(45,212,191,0.2)' : 'rgba(255,255,255,0.06)',
                      color: domain === d ? 'var(--teal-400)' : '#94a3b8',
                      border: `1px solid ${domain === d ? 'rgba(45,212,191,0.4)' : 'rgba(255,255,255,0.1)'}`,
                      transition: 'all 0.2s'
                    }}>{d}</span>
                ))}
              </div>
            </div>
          )}

          {focused && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' }}>
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                <input type="file" ref={fileRef} accept="image/*" style={{ display: 'none' }} onChange={handleImg} />
                <button onClick={() => fileRef.current.click()} title="Image" style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0.4rem', borderRadius: '50%' }}>
                  <Image size={18} />
                </button>
                <button title="Link" style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0.4rem', borderRadius: '50%' }}>
                  <Link size={18} />
                </button>
                <button onClick={() => setShowDomains(o => !o)} title="Domain" style={{ background: 'none', border: 'none', color: 'var(--teal-400)', cursor: 'pointer', padding: '0.4rem', borderRadius: '50%' }}>
                  <Compass size={18} />
                </button>
              </div>
              <button onClick={publish} style={{
                padding: '0.45rem 1.25rem', background: 'var(--teal-500)', color: '#000',
                border: 'none', borderRadius: '0.5rem', fontWeight: 700, fontSize: '0.9rem',
                cursor: 'pointer', transition: 'transform 0.15s'
              }} onMouseOver={e => e.target.style.transform = 'scale(1.05)'}
                onMouseOut={e => e.target.style.transform = ''}>
                Publish
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
