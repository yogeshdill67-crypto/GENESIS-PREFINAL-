import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getProfile, saveProfile, getPosts, savePosts, getNetwork, saveNetwork } from '../data/store'
import { showToast } from '../components/Toast'
import PostCard from '../components/PostCard'
import Modal from '../components/Modal'
import GuestBanner from '../components/GuestBanner'
import { Edit2, BookOpen, Users, MessageCircle, MapPin, Calendar, Award, UserPlus, Briefcase, GraduationCap } from 'lucide-react'

export default function Profile({ isGuest }) {
  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])
  const [editOpen, setEditOpen] = useState(false)
  const [editName, setEditName] = useState('')
  const [editPath, setEditPath] = useState('')
  const [editHeadline, setEditHeadline] = useState('')
  const [editBio, setEditBio] = useState('')
  const [editAvatar, setEditAvatar] = useState('')
  const [editCover, setEditCover] = useState('')
  const [tab, setTab] = useState('posts')
  const [network, setNetwork] = useState([])
  const { username } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    async function load() {
      const [p, ps, net] = await Promise.all([getProfile(), getPosts(), getNetwork()])
      setProfile(p)
      setPosts(ps)
      setNetwork(net)
      if (p) {
        setEditName(p.name || '')
        setEditPath(p.path || '')
        setEditHeadline(p.headline || '')
        setEditBio(p.bio || '')
        setEditAvatar(p.avatar || '')
        setEditCover(p.coverImage || '')
      }
    }
    load()
  }, [])

  if (!profile) return <div style={{ paddingTop: '10rem', textAlign: 'center', color: '#94a3b8' }}>Loading profile...</div>

  // ─── Guest-Only Profile View ───
  if (isGuest) {
    return (
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '1.5rem', paddingTop: '5rem' }}>
        <div className="glass fade-in-up" style={{ borderRadius: '1.25rem', overflow: 'hidden', marginBottom: '1.5rem' }}>
          <div className="mesh-grad" style={{ height: '180px', position: 'relative' }}>
            <div style={{ position: 'absolute', bottom: '1rem', left: '1.5rem', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)', borderRadius: '999px', padding: '0.35rem 1rem', fontSize: '0.8rem', color: '#94a3b8' }}>
              👁️ Guest Mode
            </div>
          </div>
          <div style={{ padding: '0 1.5rem 1.5rem', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-60px', left: '1.5rem' }}>
              <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid var(--slate-800)', background: 'linear-gradient(135deg, rgba(45,212,191,0.3), rgba(139,92,246,0.3))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>
                👤
              </div>
            </div>
            <div style={{ paddingTop: '75px' }}>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 0.15rem' }}>Guest User</h1>
              <div style={{ fontSize: '1rem', color: '#94a3b8', marginBottom: '0.4rem', fontWeight: 500 }}>You are browsing as a guest</div>
              <div className="font-mono" style={{ color: 'var(--teal-400)', fontSize: '0.82rem', marginBottom: '0.75rem' }}>Register to build your profile</div>
            </div>
          </div>
        </div>

        <GuestBanner />

        <div className="glass fade-in-up" style={{ borderRadius: '1rem', padding: '2rem', textAlign: 'center' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '0.75rem', fontSize: '1.1rem' }}>✨ What you'll unlock by registering</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginTop: '1.25rem', textAlign: 'left' }}>
            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.04)', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>📝</div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.25rem' }}>Create Posts</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Share career tips, ask questions, and engage with the community.</div>
            </div>
            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.04)', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>🤝</div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.25rem' }}>Connect & Message</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Build your network of mentors and peers across domains.</div>
            </div>
            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.04)', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>🎯</div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.25rem' }}>Track Your Path</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Save career analysis results and monitor your growth journey.</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ─── Dual Profile Logic ───
  const isOther = username && username !== profile.name;
  const targetNetObj = isOther ? (network.find(n => n.name === username) || { name: username, path: 'Genesis Member', status: 'connect' }) : null;
  
  const displayProfile = isOther ? {
    name: targetNetObj.name,
    headline: targetNetObj.path || 'Platform Member',
    path: targetNetObj.path || 'Platform Member',
    bio: `Hey, I'm ${targetNetObj.name}. Follow my journey on Genesis!`,
    connections: targetNetObj.mutual ? targetNetObj.mutual + 100 : Math.floor(Math.random()*400)+50,
    followers: Math.floor(Math.random()*900)+100,
    communities: Math.floor(Math.random()*10),
    education: [{ degree: 'Student / Graduate', school: 'University', year: 'Recent' }],
    experience: [{ role: 'Professional', company: 'Industry', duration: 'Present' }],
    portfolio: [],
    avatar: null, coverImage: null
  } : profile;

  const myPosts = posts.filter(p => p.author === displayProfile.name)

  function handleConnectToggle() {
    if (!isOther) return;
    let updated;
    const isCurrentlyConnected = targetNetObj.status === 'connected' || targetNetObj.status === 'pending';
    if (network.find(n => n.name === username)) {
      updated = network.map(n => n.name === username ? { ...n, status: isCurrentlyConnected ? 'connect' : 'pending' } : n)
    } else {
      updated = [...network, { id: 'net_'+Date.now(), name: username, path: displayProfile.path, status: 'pending', mutual: 0 }]
    }
    setNetwork(updated);
    saveNetwork(updated);
    showToast(isCurrentlyConnected ? 'Connection Removed' : 'Connection Request Sent 🚀');
  }

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

  const initials = displayProfile.name ? displayProfile.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : 'U';
  const pathParts = displayProfile.path ? displayProfile.path.split(' \u2192 ') : []

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '1.5rem', paddingTop: '5rem' }}>
      {/* Profile Header Card */}
      <div className="glass fade-in-up" style={{ borderRadius: '1.25rem', overflow: 'hidden', marginBottom: '1.5rem' }}>
        {/* Banner / Cover Image */}
        <div className={displayProfile.coverImage ? "" : "mesh-grad"} style={{ height: '180px', position: 'relative', backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: displayProfile.coverImage ? `url(${displayProfile.coverImage})` : 'none' }}>
          {!isGuest && !isOther && (
            <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => navigate('/post')} style={{ background: 'var(--teal-500)', border: 'none', color: '#000', borderRadius: '0.5rem', padding: '0.4rem 1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', fontWeight: 700 }}>
                + Create Post
              </button>
              <button onClick={() => setEditOpen(true)} style={{ background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff', borderRadius: '0.5rem', padding: '0.4rem 0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', backdropFilter: 'blur(4px)' }}>
                <Edit2 size={13} /> Edit Profile
              </button>
            </div>
          )}
          {!isGuest && isOther && (
            <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '0.5rem' }}>
              <button onClick={handleConnectToggle} style={{ background: (targetNetObj.status === 'connected' || targetNetObj.status === 'pending') ? 'rgba(0,0,0,0.5)' : 'var(--teal-500)', border: 'none', color: (targetNetObj.status === 'connected' || targetNetObj.status === 'pending') ? '#fff' : '#000', borderRadius: '0.5rem', padding: '0.4rem 1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', fontWeight: 700 }}>
                <UserPlus size={14} /> {(targetNetObj.status === 'connected' || targetNetObj.status === 'pending') ? (targetNetObj.status === 'connected' ? 'Connected' : 'Pending Request') : 'Connect'}
              </button>
            </div>
          )}
        </div>

        <div style={{ padding: '0 1.5rem 1.5rem', position: 'relative' }}>
          {/* Avatar */}
          <div style={{ position: 'absolute', top: '-60px', left: '1.5rem' }}>
            {displayProfile.avatar ? (
              <img src={displayProfile.avatar} alt="Avatar" style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid var(--slate-800)', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid var(--slate-800)', background: 'linear-gradient(135deg, var(--teal-500), var(--violet-500))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 800, color: '#fff' }}>
                {initials}
              </div>
            )}
          </div>

          <div style={{ paddingTop: '75px' }}>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 0.15rem' }}>{displayProfile.name}</h1>
            {displayProfile.headline && <div style={{ fontSize: '1rem', color: '#f8fafc', marginBottom: '0.4rem', fontWeight: 500 }}>{displayProfile.headline}</div>}
            {displayProfile.path && <div className="font-mono" style={{ color: 'var(--teal-400)', fontSize: '0.82rem', marginBottom: '0.75rem' }}>{displayProfile.path}</div>}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><MapPin size={14} /> India</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer', color: 'var(--teal-400)' }} onClick={() => !isOther && navigate('/network')}><Users size={14} /> {displayProfile.connections ?? 0} Connections</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><UserPlus size={14} /> {displayProfile.followers ?? 0} Followers</span>
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

      {isGuest && <GuestBanner />}

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
            <PostCard key={p.id} post={p} index={i} onLike={handleLike} onDelete={handleDelete} onEdit={handleEdit} onComment={handleComment} onUpdatePost={handleUpdatePost} currentUser={profile?.name || 'Alex Dev'} isGuest={isGuest} />
          ))}
        </div>
      )}

      {tab === 'about' && (
        <div className="glass fade-in-up" style={{ borderRadius: '1rem', padding: '1.5rem' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '1.2rem' }}>About</h3>
          <p style={{ color: '#cbd5e1', lineHeight: '1.6', fontSize: '0.95rem' }}>{displayProfile.bio || 'This user hasn\'t added a bio yet.'}</p>
        </div>
      )}

      {tab === 'background' && (
        <div className="glass fade-in-up" style={{ borderRadius: '1rem', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div>
            <h3 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Briefcase size={18} color="var(--teal-400)" /> Experience</h3>
            {displayProfile.experience && displayProfile.experience.length > 0 ? displayProfile.experience.map(exp => (
              <div key={exp.id} style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <h4 style={{ fontWeight: 600, margin: '0 0 0.25rem' }}>{exp.role}</h4>
                <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{exp.company} &bull; {exp.year}</div>
              </div>
            )) : <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>No experience listed.</p>}
          </div>

          <div>
            <h3 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><GraduationCap size={18} color="var(--violet-500)" /> Education</h3>
            {displayProfile.education && displayProfile.education.length > 0 ? displayProfile.education.map(edu => (
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
