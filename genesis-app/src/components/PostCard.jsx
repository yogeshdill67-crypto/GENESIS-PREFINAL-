import { useState } from 'react'
import { Heart, MessageSquare, Share2, MoreHorizontal, Trash2, Edit2 } from 'lucide-react'
import { showToast } from './Toast'
import { getProfile } from '../data/store'
import Modal from './Modal'

function timeSince(ts) {
  const diff = Date.now() - ts
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export default function PostCard({ post, onLike, onDelete, onEdit, onComment, onUpdatePost, index }) {
  const [showComments, setShowComments] = useState(false)
  const [commentInput, setCommentInput] = useState('')
  const [replyingTo, setReplyingTo] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(post.content)

  const currentUser = getProfile()?.name || 'Alex Dev'

  function handleLike() {
    onLike(post.id)
    if (!post.isLiked) burstHearts()
  }

  function burstHearts() {
    for (let i = 0; i < 5; i++) {
      const el = document.createElement('div')
      el.textContent = '❤️'
      el.style.cssText = `position:fixed;left:50%;top:50%;font-size:14px;pointer-events:none;z-index:9999;transition:all 0.6s ease-out;`
      document.body.appendChild(el)
      const angle = (i / 5) * Math.PI * 2
      const dist = 50 + Math.random() * 20
      setTimeout(() => { el.style.transform = `translate(${Math.cos(angle)*dist}px,${Math.sin(angle)*dist-30}px) scale(0)`; el.style.opacity = '0' }, 10)
      setTimeout(() => el.remove(), 700)
    }
  }

  function addCommentOrReply() {
    if (!commentInput.trim()) return

    const newObj = {
      id: Date.now(),
      text: commentInput,
      author: currentUser,
      replyingToUser: replyingTo ? replyingTo.author : null,
      isLiked: false,
      likes: 0,
      replies: []
    }

    if (replyingTo && onUpdatePost) {
      const currentComments = Array.isArray(post.commentsList) ? post.commentsList : []
      const updatedComments = currentComments.map(c => {
        if (c.id === replyingTo.parentId) {
          return { ...c, replies: [...(Array.isArray(c.replies) ? c.replies : []), newObj] }
        }
        return c
      })
      onUpdatePost({ ...post, comments: (post.comments || 0) + 1, commentsList: updatedComments })
    } else {
      onComment(post.id, newObj)
    }
    setCommentInput('')
    setReplyingTo(null)
  }

  function handleLikeComment(cId) {
    if (!onUpdatePost) return
    const currentComments = Array.isArray(post.commentsList) ? post.commentsList : []
    const updated = currentComments.map(c => 
      c.id === cId ? { ...c, isLiked: !c.isLiked, likes: (c.likes || 0) + (c.isLiked ? -1 : 1) } : c
    )
    onUpdatePost({ ...post, commentsList: updated })
  }

  function handleLikeReply(cId, rId) {
    if (!onUpdatePost) return
    const currentComments = Array.isArray(post.commentsList) ? post.commentsList : []
    const updated = currentComments.map(c => {
      if (c.id === cId) {
        const currentReplies = Array.isArray(c.replies) ? c.replies : []
        const urep = currentReplies.map(r => r.id === rId ? { ...r, isLiked: !r.isLiked, likes: (r.likes || 0) + (r.isLiked ? -1 : 1) } : r)
        return { ...c, replies: urep }
      }
      return c
    })
    onUpdatePost({ ...post, commentsList: updated })
  }

  const initials = String(post.author || '??').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div className="glass card-3d fade-in-up"
      style={{ borderRadius: '1rem', padding: '1.25rem', animationDelay: `${index * 80}ms`, position: 'relative' }}
      onMouseMove={e => {
        const r = e.currentTarget.getBoundingClientRect()
        const x = (e.clientX - r.left - r.width / 2) / r.width
        const y = (e.clientY - r.top - r.height / 2) / r.height
        e.currentTarget.style.transform = `perspective(800px) rotateX(${y * -5}deg) rotateY(${x * 5}deg) translateY(-4px)`
      }}
      onMouseLeave={e => { e.currentTarget.style.transform = '' }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{
            width: '42px', height: '42px', borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--teal-400), var(--violet-500))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: '0.9rem', color: '#fff', flexShrink: 0
          }}>{initials}</div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{post.author}</div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
              {post.path} · {post.domain} · {timeSince(post.timestamp || Date.now())}
            </div>
          </div>
        </div>

        <div style={{ position: 'relative' }}>
          <button onClick={() => setMenuOpen(o => !o)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0.25rem' }}>
            <MoreHorizontal size={20} />
          </button>
          {menuOpen && (
            <div className="glass" style={{ position: 'absolute', right: 0, top: '2rem', borderRadius: '0.6rem', minWidth: '140px', zIndex: 50, padding: '0.3rem' }}>
              <button onClick={() => { navigator.clipboard.writeText('https://genesis.app/p/' + post.id); showToast('Link copied!'); setMenuOpen(false) }}
                style={{ display: 'block', width: '100%', textAlign: 'left', padding: '0.5rem 0.75rem', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', borderRadius: '0.4rem', fontSize: '0.875rem' }}>
                Copy Link
              </button>
              {post.author === currentUser && (
                <>
                  <button onClick={() => { setIsEditing(true); setMenuOpen(false) }}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', width: '100%', textAlign: 'left', padding: '0.5rem 0.75rem', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', borderRadius: '0.4rem', fontSize: '0.875rem' }}>
                    <Edit2 size={14} /> Edit
                  </button>
                  <button onClick={() => { onDelete(post.id); setMenuOpen(false) }}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', width: '100%', textAlign: 'left', padding: '0.5rem 0.75rem', background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', borderRadius: '0.4rem', fontSize: '0.875rem' }}>
                    <Trash2 size={14} /> Delete
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      {isEditing ? (
        <div style={{ margin: '1rem 0' }}>
          <textarea className="inp" style={{ width: '100%', minHeight: '80px', fontSize: '0.95rem', resize: 'vertical' }} value={editContent} onChange={e => setEditContent(e.target.value)} />
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', justifyContent: 'flex-end' }}>
            <button onClick={() => { setIsEditing(false); setEditContent(post.content) }} style={{ padding: '0.4rem 0.8rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#cbd5e1', borderRadius: '0.4rem', cursor: 'pointer', fontSize: '0.875rem' }}>Cancel</button>
            <button onClick={() => { onEdit && onEdit(post.id, editContent); setIsEditing(false) }} style={{ padding: '0.4rem 0.8rem', background: 'var(--teal-500)', border: 'none', color: '#000', borderRadius: '0.4rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}>Save</button>
          </div>
        </div>
      ) : (
        <p style={{ margin: '1rem 0 0.75rem', lineHeight: 1.7, fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}>{post.content}</p>
      )}

      {post.image && (
        <div style={{ marginTop: '0.75rem', marginBottom: '1rem', borderRadius: '0.75rem', overflow: 'hidden' }}>
          <img src={post.image} alt="Post image" style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', display: 'block' }} />
        </div>
      )}

      {/* Domain tag */}
      <span style={{ display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.7rem', background: 'rgba(45,212,191,0.1)', color: 'var(--teal-400)', border: '1px solid rgba(45,212,191,0.25)' }}>
        {post.domain}
      </span>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <button onClick={handleLike} style={{
          display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'none', border: 'none',
          color: post.isLiked ? '#f87171' : '#94a3b8', cursor: 'pointer', fontSize: '0.875rem', transition: 'color 0.2s'
        }}>
          <Heart size={18} fill={post.isLiked ? '#f87171' : 'none'} />
          <span>{post.likes}</span>
        </button>

        <button onClick={() => setShowComments(o => !o)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.875rem' }}>
          <MessageSquare size={18} />
          <span>{post.comments}</span>
        </button>

        <button onClick={() => { navigator.clipboard.writeText('https://genesis.app/p/' + post.id); showToast('Link copied!') }}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.875rem' }}>
          <Share2 size={18} />
        </button>
      </div>

      {/* Comments Modal */}
      {showComments && (
        <Modal title="Comments" onClose={() => setShowComments(false)}>
          <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.8rem', minHeight: '120px' }} className="custom-scroll">
            {(!Array.isArray(post.commentsList) || post.commentsList.length === 0) ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>No comments yet. Be the first!</div>
            ) : (
              post.commentsList.map((c, i) => (
                <div key={c.id || i} style={{ marginBottom: '1rem', borderBottom: i < post.commentsList.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', paddingBottom: '1rem' }}>
                  <div style={{ padding: '0.6rem 0.8rem', background: 'rgba(255,255,255,0.04)', borderRadius: '0.5rem', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <strong>{c.author || 'User'}</strong>
                      <button onClick={() => handleLikeComment(c.id)} style={{ background: 'none', border: 'none', color: c.isLiked ? '#f87171' : '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.75rem' }}>
                        <Heart size={12} fill={c.isLiked ? '#f87171' : 'none'} /> {(c.likes || 0) > 0 && c.likes}
                      </button>
                    </div>
                    <div style={{ margin: '0.3rem 0', color: '#cbd5e1' }}>{c.text}</div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.4rem' }}>
                      <button onClick={() => { 
                        const isSame = replyingTo?.parentId === c.id && !replyingTo.replyId;
                        setReplyingTo(isSame ? null : { parentId: c.id, author: c.author || 'User' }); 
                      }} style={{ background: 'none', border: 'none', color: (replyingTo?.parentId === c.id && !replyingTo.replyId) ? 'var(--teal-400)' : '#94a3b8', fontSize: '0.75rem', cursor: 'pointer', padding: 0 }}>
                        Reply
                      </button>
                    </div>
                  </div>
                  
                  {/* Replies */}
                  {Array.isArray(c.replies) && c.replies.length > 0 && (
                    <div style={{ marginLeft: '1.5rem', marginTop: '0.6rem', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '0.8rem' }}>
                      {c.replies.map(r => (
                        <div key={r.id} style={{ padding: '0.5rem 0.8rem', background: 'rgba(255,255,255,0.02)', borderRadius: '0.5rem', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <strong>{r.author || 'User'}</strong>
                            <button onClick={() => handleLikeReply(c.id, r.id)} style={{ background: 'none', border: 'none', color: r.isLiked ? '#f87171' : '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.75rem' }}>
                              <Heart size={12} fill={r.isLiked ? '#f87171' : 'none'} /> {(r.likes || 0) > 0 && r.likes}
                            </button>
                          </div>
                          <div style={{ marginTop: '0.3rem', color: '#cbd5e1' }}>
                            {r.replyingToUser && (
                              <span style={{ color: 'var(--teal-400)', fontWeight: 500, marginRight: '4px' }}>@{r.replyingToUser}</span>
                            )}
                            {r.text}
                          </div>
                          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.4rem' }}>
                            <button onClick={() => { 
                              const isSame = replyingTo?.replyId === r.id;
                              setReplyingTo(isSame ? null : { parentId: c.id, replyId: r.id, author: r.author || 'User' });
                            }} style={{ background: 'none', border: 'none', color: replyingTo?.replyId === r.id ? 'var(--teal-400)' : '#94a3b8', fontSize: '0.75rem', cursor: 'pointer', padding: 0 }}>
                              Reply
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem' }}>
            <input 
              autoFocus
              className="inp" 
              style={{ flex: 1, fontSize: '0.875rem' }} 
              placeholder={replyingTo ? `Replying to @${replyingTo.author}…` : "Write a comment…"}
              value={commentInput} 
              onChange={e => setCommentInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addCommentOrReply()} 
            />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                onClick={() => setShowComments(false)}
                style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', color: '#94a3b8', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.1)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
              >
                Close
              </button>
              <button 
                onClick={addCommentOrReply} 
                style={{ padding: '0.5rem 1.25rem', background: 'var(--teal-500)', color: '#000', borderRadius: '0.5rem', border: 'none', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
              >
                Post
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
