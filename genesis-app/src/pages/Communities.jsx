import { useState, useEffect } from 'react'
import { getCommunities, saveCommunities } from '../data/store'
import { showToast } from '../components/Toast'
import Modal from '../components/Modal'
import { Users, Star, Link, Video } from 'lucide-react'

export default function Communities() {
  const [communities, setCommunities] = useState([])
  const [filter, setFilter] = useState('All')
  const [active, setActive] = useState(null)

  useEffect(() => {
    async function load() {
      const comms = await getCommunities()
      setCommunities(comms || [])
    }
    load()
  }, [])

  function toggleJoin(id) {
    const updated = communities.map(c =>
      c.id === id ? { ...c, joined: !c.joined, members: c.joined ? c.members - 1 : c.members + 1 } : c
    )
    setCommunities(updated)
    saveCommunities(updated)
    const c = updated.find(x => x.id === id)
    showToast(c.joined ? 'Joined community! 🎉' : 'Left community')
  }

  const displayed = filter === 'All' ? communities : communities.filter(c => c.joined)
  const openCom = active ? communities.find(c => c.id === active) : null

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.5rem', paddingTop: '5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Users size={26} style={{ color: 'var(--teal-400)' }} /> Communities
          </h1>
          <p style={{ color: '#94a3b8', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>Join communities that match your career path</p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['All', 'Joined'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '0.4rem 1.1rem', borderRadius: '999px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem',
              background: filter === f ? 'var(--teal-500)' : 'rgba(255,255,255,0.08)',
              color: filter === f ? '#000' : 'inherit', transition: 'all 0.2s'
            }}>{f}</button>
          ))}
        </div>
      </div>

      {displayed.length === 0 && (
        <div className="glass" style={{ borderRadius: '1rem', padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
          You haven't joined any communities yet. Explore and join some!
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {displayed.map((com, i) => (
          <div key={com.id} className="glass card-3d fade-in-up" style={{ borderRadius: '1rem', overflow: 'hidden', cursor: 'pointer', animationDelay: `${i * 70}ms` }}
            onMouseMove={e => {
              const r = e.currentTarget.getBoundingClientRect()
              const x = (e.clientX - r.left - r.width / 2) / r.width
              const y = (e.clientY - r.top - r.height / 2) / r.height
              e.currentTarget.style.transform = `perspective(800px) rotateX(${y * -4}deg) rotateY(${x * 4}deg) translateY(-4px)`
            }}
            onMouseLeave={e => { e.currentTarget.style.transform = '' }}
            onClick={() => setActive(com.id)}>

            {/* Banner */}
            <div className="mesh-grad" style={{ height: '80px', position: 'relative', display: 'flex', alignItems: 'flex-end', padding: '0.6rem 0.8rem' }}>
              {com.joined && (
                <span style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', padding: '0.15rem 0.5rem', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 700, position: 'absolute', top: '0.6rem', right: '0.6rem' }}>
                  ✓ JOINED
                </span>
              )}
            </div>

            <div style={{ padding: '1rem' }}>
              <h3 style={{ margin: '0 0 0.2rem', fontWeight: 700, fontSize: '1rem' }}>{com.name}</h3>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '0.75rem' }}>
                {com.domain} · {com.members.toLocaleString()} members
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
                {com.tags.map(t => (
                  <span key={t} style={{ fontSize: '0.72rem', color: 'var(--teal-400)', background: 'rgba(45,212,191,0.1)', border: '1px solid rgba(45,212,191,0.2)', padding: '0.15rem 0.5rem', borderRadius: '999px' }}>{t}</span>
                ))}
              </div>
              <button onClick={e => { e.stopPropagation(); toggleJoin(com.id) }} style={{
                width: '100%', padding: '0.5rem', borderRadius: '0.5rem', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '0.875rem', transition: 'all 0.2s',
                background: com.joined ? 'var(--teal-500)' : 'rgba(255,255,255,0.08)',
                color: com.joined ? '#000' : 'inherit'
              }}>
                {com.joined ? '✓ Joined' : 'Join Community'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Community detail modal */}
      {openCom && (
        <Modal onClose={() => setActive(null)}>
          <div>
            <div className="mesh-grad" style={{ borderRadius: '0.75rem', height: '100px', display: 'flex', alignItems: 'flex-end', padding: '1rem', margin: '-1.5rem -1.5rem 1rem' }}>
              <h2 style={{ margin: 0, fontWeight: 700, fontSize: '1.4rem', fontFamily: 'var(--font-mono)' }}>{openCom.name}</h2>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ color: 'var(--teal-400)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>{openCom.domain}</span>
              <span style={{ fontSize: '0.85rem', border: '1px solid rgba(255,255,255,0.2)', padding: '0.1rem 0.5rem', borderRadius: '0.4rem' }}>{openCom.members.toLocaleString()} members</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {[{ icon: <Link size={15}/>, label: 'Starter Resource Pack' }, { icon: <Video size={15}/>, label: 'Weekly Meetup – Saturday' }, { icon: <Star size={15}/>, label: 'Top Discussions' }].map(item => (
                <div key={item.label} className="glass" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 0.75rem', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                  {item.icon} {item.label}
                </div>
              ))}
            </div>
            <button onClick={() => toggleJoin(openCom.id)} style={{
              width: '100%', padding: '0.65rem', borderRadius: '0.6rem', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem',
              background: openCom.joined ? '#ef4444' : 'var(--teal-500)',
              color: '#000', transition: 'background 0.2s'
            }}>
              {openCom.joined ? 'Leave Community' : 'Join Community'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
