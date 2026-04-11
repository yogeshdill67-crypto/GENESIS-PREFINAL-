import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProfile, saveProfile, getPosts, savePosts } from '../data/store'
import { showToast } from '../components/Toast'
import PostCard from '../components/PostCard'
import Modal from '../components/Modal'
import { Edit2, BookOpen, Users, MessageCircle, MapPin, Calendar, Award, UserPlus, Briefcase, GraduationCap } from 'lucide-react'

export default function Profile() {
  const [profile, setProfile] = useState(getProfile())
  const [posts, setPosts] = useState(getPosts())
  const [editOpen, setEditOpen] = useState(false)
  const [editName, setEditName] = useState(profile.name)
  const [editPath, setEditPath] = useState(profile.path)
  const [editHeadline, setEditHeadline] = useState(profile.headline || '')
  const [editBio, setEditBio] = useState(profile.bio || '')
  const [editAvatar, setEditAvatar] = useState(profile.avatar || '')
  const [editCover, setEditCover] = useState(profile.coverImage || '')
  const [tab, setTab] = useState('posts')
  const navigate = useNavigate()

  const myPosts = posts.filter(p => p.author === profile.name)

  function handleAvatarChange(e) {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setEditAvatar(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  function handleCoverChange(e) {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setEditCover(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  function saveEdit() {
    const updated = { ...profile, name: editName, path: editPath, headline: editHeadline, bio: editBio, avatar: editAvatar, coverImage: editCover }
    setProfile(updated)
    saveProfile(updated)
    setEditOpen(false)
    showToast('Profile updated \u2713')
  }

  function handleLike(id) {
    const updated = posts.map(p => p.id === id ? { ...p, isLiked: !p.isLiked, likes: p.likes + (p.isLiked ? -1 : 1) } : p)
    setPosts(updated); savePosts(updated)
  }

  function handleDelete(id) {
    const updated = posts.filter(p => p.id !== id)
    setPosts(updated); savePosts(updated); showToast('Post deleted')
  }

  function handleEdit(id, newContent) {
    const updated = posts.map(p => p.id === id ? { ...p, content: newContent } : p)
    setPosts(updated); savePosts(updated); showToast('Post updated')
  }

  function handleComment(id, commentObj) {
    const updated = posts.map(p => p.id === id ? { 
      ...p, 
      comments: (p.comments || 0) + 1,
      commentsList: [...(p.commentsList || []), commentObj]
    } : p)
    setPosts(updated); savePosts(updated)
  }

  function handleUpdatePost(updatedPost) {
    const updated = posts.map(p => p.id === updatedPost.id ? updatedPost : p)
    setPosts(updated)
    savePosts(updated)
  }

  const initials = profile.name ? profile.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : 'U';
  const pathParts = profile.path ? profile.path.split(' \u2192 ') : []

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '1.5rem', paddingTop: '5rem' }}>
      {/* Profile Header Card */}
      <div className="glass fade-in-up" style={{ borderRadius: '1.25rem', overflow: 'hidden', marginBottom: '1.5rem' }}>
        {/* Banner / Cover Image */}
        <div className={profile.coverImage ? "" : "mesh-grad"} style={{ height: '180px', position: 'relative', backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: profile.coverImage ? `url(${profile.coverImage})` : 'none' }}>
          <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => navigate('/post')} style={{ background: 'var(--teal-500)', border: 'none', color: '#000', borderRadius: '0.5rem', padding: '0.4rem 1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', fontWeight: 700 }}>
              + Create Post
            </button>
            <button onClick={() => setEditOpen(true)} style={{ background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff', borderRadius: '0.5rem', padding: '0.4rem 0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', backdropFilter: 'blur(4px)' }}>
              <Edit2 size={13} /> Edit Profile
            </button>
          </div>
        </div>

        <div style={{ padding: '0 1.5rem 1.5rem', position: 'relative' }}>
          {/* Avatar */}
          <div style={{ position: 'absolute', top: '-60px', left: '1.5rem' }}>
            {profile.avatar ? (
              <img src={profile.avatar} alt="Avatar" style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid var(--slate-800)', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid var(--slate-800)', background: 'linear-gradient(135deg, var(--teal-500), var(--violet-500))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 800, color: '#fff' }}>
                {initials}
              </div>
            )}
          </div>

          <div style={{ paddingTop: '75px' }}>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 0.15rem' }}>{profile.name}</h1>
            {profile.headline && <div style={{ fontSize: '1rem', color: '#f8fafc', marginBottom: '0.4rem', fontWeight: 500 }}>{profile.headline}</div>}
            {profile.path && <div className="font-mono" style={{ color: 'var(--teal-400)', fontSize: '0.82rem', marginBottom: '0.75rem' }}>{profile.path}</div>}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><MapPin size={14} /> India</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer', color: 'var(--teal-400)' }} onClick={() => navigate('/network')}><Users size={14} /> {profile.connections ?? 0} Connections</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><UserPlus size={14} /> {profile.followers ?? 0} Followers</span>
            </div>

            {/* Career path badges */}
            {pathParts.length > 0 && (
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {pathParts.map((part, i) => (
                  <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <span style={{ padding: '0.25rem 0.65rem', borderRadius: '999px', fontSize: '0.75rem', background: i === pathParts.length - 1 ? 'rgba(45,212,191,0.15)' : 'rgba(255,255,255,0.07)', color: i === pathParts.length - 1 ? 'var(--teal-400)' : '#94a3b8', border: `1px solid ${i === pathParts.length - 1 ? 'rgba(45,212,191,0.3)' : 'rgba(255,255,255,0.08)'}` }}>{part}</span>
                    {i < pathParts.length - 1 && <span style={{ color: '#94a3b8', fontSize: '0.7rem' }}>→</span>}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        {['posts', 'about', 'background'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '0.5rem 1.25rem', borderRadius: '999px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', textTransform: 'capitalize',
            background: tab === t ? 'var(--teal-500)' : 'rgba(255,255,255,0.07)',
            color: tab === t ? '#000' : '#94a3b8', transition: 'all 0.2s'
          }}>{t}</button>
        ))}
      </div>

      {tab === 'posts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {myPosts.length === 0 ? (
            <div className="glass" style={{ borderRadius: '1rem', padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
              No posts yet. Start sharing your journey!
            </div>
          ) : myPosts.map((p, i) => (
            <PostCard key={p.id} post={p} index={i} onLike={handleLike} onDelete={handleDelete} onEdit={handleEdit} onComment={handleComment} onUpdatePost={handleUpdatePost} />
          ))}
        </div>
      )}

      {tab === 'about' && (
        <div className="glass fade-in-up" style={{ borderRadius: '1rem', padding: '1.5rem' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '1.2rem' }}>About</h3>
          <p style={{ color: '#cbd5e1', lineHeight: '1.6', fontSize: '0.95rem' }}>{profile.bio || 'This user hasn\'t added a bio yet.'}</p>
        </div>
      )}

      {tab === 'background' && (
        <div className="glass fade-in-up" style={{ borderRadius: '1rem', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div>
            <h3 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Briefcase size={18} color="var(--teal-400)" /> Experience</h3>
            {profile.experience && profile.experience.length > 0 ? profile.experience.map(exp => (
              <div key={exp.id} style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <h4 style={{ fontWeight: 600, margin: '0 0 0.25rem' }}>{exp.role}</h4>
                <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{exp.company} &bull; {exp.year}</div>
              </div>
            )) : <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>No experience listed.</p>}
          </div>

          <div>
            <h3 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><GraduationCap size={18} color="var(--violet-500)" /> Education</h3>
            {profile.education && profile.education.length > 0 ? profile.education.map(edu => (
              <div key={edu.id} style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <h4 style={{ fontWeight: 600, margin: '0 0 0.25rem' }}>{edu.school}</h4>
                <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{edu.degree} &bull; {edu.year}</div>
              </div>
            )) : <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>No education listed.</p>}
          </div>

        </div>
      )}

      {/* Edit modal */}
      {editOpen && (
        <Modal title="Edit Profile" onClose={() => setEditOpen(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '70vh', overflowY: 'auto', paddingRight: '0.5rem' }}>
            
            <label style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Cover Image</label>
            <input type="file" accept="image/*" onChange={handleCoverChange} style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.5rem' }} />

            <label style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Profile Picture</label>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem' }}>
              {editAvatar ? (
                <img src={editAvatar} alt="preview" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--teal-500), var(--violet-500))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 700, color: '#fff' }}>
                  {initials}
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ fontSize: '0.8rem', color: '#94a3b8' }} />
            </div>

            <label style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Display Name</label>
            <input className="inp" value={editName} onChange={e => setEditName(e.target.value)} />

            <label style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Headline / Tagline</label>
            <input className="inp" value={editHeadline} onChange={e => setEditHeadline(e.target.value)} placeholder="e.g. UI Designer | Freelancer | Open to Collaborate" />

            <label style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Career Path Domain</label>
            <input className="inp" value={editPath} onChange={e => setEditPath(e.target.value)} placeholder="B.Tech \u2192 CSE \u2192 ML Engineer" />

            <label style={{ fontSize: '0.8rem', color: '#94a3b8' }}>About / Bio</label>
            <textarea className="inp" rows={4} value={editBio} onChange={e => setEditBio(e.target.value)} style={{ resize: 'vertical' }} />

            <button onClick={saveEdit} style={{ padding: '0.8rem', background: 'var(--teal-500)', color: '#000', border: 'none', borderRadius: '0.6rem', fontWeight: 700, cursor: 'pointer', marginTop: '1rem' }}>
              Save All Changes
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
