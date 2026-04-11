import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PostCard from '../components/PostCard'
import { showToast } from '../components/Toast'
import { getPosts, savePosts, getProfile } from '../data/store'
import { User, MessageCircle } from 'lucide-react'

export default function Home() {
  const [posts, setPosts] = useState(getPosts)
  const [profile] = useState(getProfile)
  const navigate = useNavigate()

  function handleLike(id) {
    const updated = posts.map(p =>
      p.id === id ? { ...p, isLiked: !p.isLiked, likes: p.likes + (p.isLiked ? -1 : 1) } : p
    )
    setPosts(updated)
    savePosts(updated)
  }

  function handleDelete(id) {
    const updated = posts.filter(p => p.id !== id)
    setPosts(updated)
    savePosts(updated)
    showToast('Post deleted')
  }

  function handleEdit(id, newContent) {
    const updated = posts.map(p => p.id === id ? { ...p, content: newContent } : p)
    setPosts(updated)
    savePosts(updated)
    showToast('Post updated')
  }

  function handleComment(id, commentObj) {
    const updated = posts.map(p => p.id === id ? { 
      ...p, 
      comments: p.comments + 1,
      commentsList: [...(p.commentsList || []), commentObj]
    } : p)
    setPosts(updated)
    savePosts(updated)
  }

  function handleUpdatePost(updatedPost) {
    const updated = posts.map(p => p.id === updatedPost.id ? updatedPost : p)
    setPosts(updated)
    savePosts(updated)
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1.5rem', paddingTop: '5rem' }}>
      {/* Create Post Prompt */}
      <div className="glass" style={{ borderRadius: '1.25rem', padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem', cursor: 'text', transition: 'all 0.2s' }} onClick={() => navigate('/post')}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--teal-400), var(--violet-500))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem', color: '#fff', flexShrink: 0 }}>
          {profile?.name ? profile.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : 'ME'}
        </div>
        <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '2rem', padding: '0.8rem 1.25rem', color: '#94a3b8', fontSize: '0.95rem' }} className="hover-bg">
          Start a post, share your journey...
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {posts.length === 0 ? (
          <div className="glass" style={{ borderRadius: '1rem', padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
            <User size={40} style={{ margin: '0 auto 1rem', display: 'block', opacity: 0.3 }} />
            No posts yet. Be the first to share!
          </div>
        ) : posts.map((p, i) => (
          <PostCard key={p.id} post={p} index={i} onLike={handleLike} onDelete={handleDelete} onEdit={handleEdit} onComment={handleComment} onUpdatePost={handleUpdatePost} />
        ))}
      </div>
    </div>
  )
}
