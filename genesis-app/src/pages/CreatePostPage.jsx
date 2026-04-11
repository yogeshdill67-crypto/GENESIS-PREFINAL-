import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Image, Compass, X, Send, ArrowLeft, Tag } from 'lucide-react'
import { getProfile, getPosts, savePosts } from '../data/store'
import { showToast } from '../components/Toast'

const DOMAINS = ['B.Tech → CSE', 'B.Tech → Mech', 'B.Tech → Civil', 'MBA → Marketing', 'MBA → Finance', 'General']
const TAGS = ['#Career', '#Tips', '#Opportunities', '#Interview', '#Learning', '#Project', '#Hiring', '#Internship']

export default function CreatePostPage() {
  const [content, setContent] = useState('')
  const [domain, setDomain] = useState('')
  const [selectedTags, setSelectedTags] = useState([])
  const [imgSrc, setImgSrc] = useState(null)
  const [publishing, setPublishing] = useState(false)
  const fileRef = useRef()
  const profile = getProfile()
  const navigate = useNavigate()

  const charLimit = 1000
  const remaining = charLimit - content.length

  function toggleTag(tag) {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
  }

  function handleImg(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setImgSrc(ev.target.result)
    reader.readAsDataURL(file)
  }

  function publish() {
    if (!content.trim()) { showToast('Write something first!', 'error'); return }
    setPublishing(true)

    setTimeout(() => {
      const posts = getPosts()
      const newPost = {
        id: Date.now(),
        author: profile.name,
        path: profile.path.split(' → ').slice(-2).join(' → '),
        content: content + (selectedTags.length ? '\n' + selectedTags.join(' ') : ''),
        likes: 0, comments: 0, commentsList: [],
        domain: domain || 'General',
        isLiked: false,
        timestamp: Date.now(),
        image: imgSrc
      }
      savePosts([newPost, ...posts])
      showToast('Post published! 🚀')
      navigate('/')
    }, 800)
  }

  const initials = profile.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '1.5rem', paddingTop: '5rem' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.6rem', padding: '0.5rem 0.8rem', color: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem' }}>
          <ArrowLeft size={16} /> Back
        </button>
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>Create Post</h1>
      </div>

      {/* Main composer card */}
      <div className="glass" style={{ borderRadius: '1.25rem', padding: '1.5rem', marginBottom: '1rem' }}>
        {/* Author row */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--teal-400), var(--violet-500))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.95rem', color: '#fff', flexShrink: 0 }}>
            {initials}
          </div>
          <div>
            <div style={{ fontWeight: 600 }}>{profile.name}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--teal-400)', fontFamily: 'var(--font-mono)' }}>{profile.path}</div>
          </div>
        </div>

        {/* Textarea */}
        <textarea
          rows={8}
          autoFocus
          style={{
            width: '100%', background: 'transparent', border: 'none', outline: 'none', resize: 'none',
            color: 'inherit', fontFamily: 'inherit', fontSize: '1.05rem', lineHeight: 1.75, boxSizing: 'border-box'
          }}
          placeholder="What's on your mind? Share your career journey, tips, or opportunities..."
          value={content}
          onChange={e => setContent(e.target.value.slice(0, charLimit))}
          maxLength={charLimit}
        />

        {/* Image preview */}
        {imgSrc && (
          <div style={{ position: 'relative', borderRadius: '0.75rem', overflow: 'hidden', marginTop: '1rem' }}>
            <img src={imgSrc} alt="preview" style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', display: 'block' }} />
            <button onClick={() => setImgSrc(null)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.65)', border: 'none', borderRadius: '50%', color: '#fff', cursor: 'pointer', padding: '6px', display: 'flex' }}>
              <X size={16} />
            </button>
          </div>
        )}

        {/* Char counter */}
        <div style={{ textAlign: 'right', fontSize: '0.75rem', color: remaining < 100 ? '#f87171' : '#94a3b8', marginTop: '0.5rem' }}>
          {remaining} remaining
        </div>

        {/* Toolbar */}
        <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.07)', marginTop: '0.5rem' }}>
          <input type="file" ref={fileRef} accept="image/*" style={{ display: 'none' }} onChange={handleImg} />
          <button onClick={() => fileRef.current.click()} title="Attach Image" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', padding: '0.45rem 0.85rem', color: '#94a3b8', cursor: 'pointer', fontSize: '0.82rem' }}>
            <Image size={16} /> Image
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flex: 1 }}>
            <Tag size={14} style={{ color: '#94a3b8', flexShrink: 0 }} />
            <select value={domain} onChange={e => setDomain(e.target.value)} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', padding: '0.45rem 0.6rem', color: 'inherit', fontFamily: 'inherit', fontSize: '0.82rem', outline: 'none', cursor: 'pointer' }}>
              <option value="">Select Domain</option>
              {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Hashtag pills */}
      <div className="glass" style={{ borderRadius: '1rem', padding: '1rem', marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Add Tags</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {TAGS.map(tag => (
            <span key={tag} onClick={() => toggleTag(tag)} style={{
              padding: '0.3rem 0.75rem', borderRadius: '999px', fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.15s',
              background: selectedTags.includes(tag) ? 'rgba(45,212,191,0.2)' : 'rgba(255,255,255,0.06)',
              color: selectedTags.includes(tag) ? 'var(--teal-400)' : '#94a3b8',
              border: `1px solid ${selectedTags.includes(tag) ? 'rgba(45,212,191,0.4)' : 'rgba(255,255,255,0.1)'}`,
              fontWeight: selectedTags.includes(tag) ? 600 : 400,
              userSelect: 'none'
            }}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Publish button */}
      <button
        onClick={publish}
        disabled={publishing || !content.trim()}
        style={{
          width: '100%', padding: '0.85rem', background: content.trim() ? 'var(--teal-500)' : 'rgba(255,255,255,0.08)',
          color: content.trim() ? '#000' : '#94a3b8', border: 'none', borderRadius: '0.75rem',
          fontWeight: 700, fontSize: '1rem', cursor: content.trim() ? 'pointer' : 'not-allowed',
          transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
        }}
      >
        {publishing ? (
          <>
            <span style={{ width: '18px', height: '18px', border: '2px solid rgba(0,0,0,0.3)', borderTop: '2px solid #000', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
            Publishing…
          </>
        ) : (
          <><Send size={18} /> Publish Post</>
        )}
      </button>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        select option { background: #1e293b; color: #f8fafc; }
      `}</style>
    </div>
  )
}
