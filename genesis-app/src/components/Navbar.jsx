import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Search, Bell, Moon, Sun, User, Menu, X, PenSquare, MessageCircle } from 'lucide-react'
import { sampleNotifications, logout } from '../data/store'

export default function Navbar({ theme, onToggleTheme, profile, posts, isGuest }) {
  const [scrolled, setScrolled] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchVal, setSearchVal] = useState('')
  const [notifs, setNotifs] = useState(sampleNotifications || [])
  const location = useLocation()
  const navigate = useNavigate()
  const searchRef = useRef(null)
  const navRef = useRef(null)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    function handleClickOutside(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setProfileOpen(false)
        setNotifOpen(false)
        setMobileOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus()
  }, [searchOpen])

  function handleLogout() {
    logout()
    navigate('/login')
  }

  function markRead() {
    setNotifs(n => n.map(x => ({ ...x, read: true })))
  }

  const unread = (notifs || []).filter(n => !n.read).length

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/network', label: 'Network' },
    { to: '/explore', label: 'Explore' },
    { to: '/communities', label: 'Communities' },
    { to: '/profile', label: 'Profile' },
  ]

  const searchResults = searchVal.trim().length > 1
    ? (posts || []).filter(p => p.content.toLowerCase().includes(searchVal.toLowerCase())).slice(0, 4)
    : []

  return (
    <>
      {/* Search overlay */}
      {searchOpen && (
        <div className="modal-overlay" onClick={() => setSearchOpen(false)} style={{ alignItems: 'flex-start', paddingTop: '5rem' }}>
          <div style={{ width: '100%', maxWidth: '640px', margin: '0 1rem' }} onClick={e => e.stopPropagation()}>
            <div className="glass" style={{ borderRadius: '1rem', padding: '0.75rem 1rem', position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                ref={searchRef}
                className="inp"
                style={{ paddingLeft: '2.5rem', fontSize: '1.1rem', background: 'transparent', border: 'none' }}
                placeholder="Search posts, communities…"
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                onKeyDown={e => e.key === 'Escape' && setSearchOpen(false)}
              />
              <button onClick={() => setSearchOpen(false)} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8' }}>
                <X size={18} />
              </button>
            </div>
            {searchResults.length > 0 && (
              <div className="glass" style={{ borderRadius: '1rem', marginTop: '0.5rem', padding: '0.5rem' }}>
                {searchResults.map(p => (
                  <div key={p.id} style={{ padding: '0.75rem', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}
                    className="hover-bg"
                    onClick={() => { setSearchOpen(false); navigate('/') }}>
                    <span style={{ fontWeight: 600 }}>{p.author}: </span>
                    {p.content.substring(0, 60)}…
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <nav ref={navRef} className="glass" style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: '64px',
        boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.3)' : 'none',
        transition: 'box-shadow 0.3s'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <Link to="/" style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1.25rem', letterSpacing: '0.1em', color: 'var(--teal-400)', textDecoration: 'none', textShadow: '0 0 12px rgba(45,212,191,0.5)' }}>
            GENESIS
          </Link>

          {/* Desktop nav */}
          <div style={{ display: 'flex', gap: '2rem' }} className="hide-mobile">
            {navLinks.map(l => (
              <Link key={l.to} to={l.to} className={`nav-link${location.pathname === l.to ? ' active' : ''}`}
                style={{ fontWeight: 500, fontSize: '0.95rem' }}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* Right icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button className="icon-btn" onClick={() => setSearchOpen(true)} title="Search">
              <Search size={20} />
            </button>

            {/* Create Post */}
            {!isGuest && (
              <div style={{ position: 'relative' }}>
                <button className="icon-btn" onClick={() => navigate('/post')} title="Create Post" style={{ color: 'var(--teal-400)' }}>
                  <PenSquare size={20} />
                </button>
              </div>
            )}

            {/* Messages */}
            {!isGuest && (
              <div style={{ position: 'relative' }}>
                <button className="icon-btn" onClick={() => navigate('/messages')} title="Messages">
                  <MessageCircle size={20} />
                </button>
              </div>
            )}

            {/* Notifications */}
            <div style={{ position: 'relative' }}>
              <button className="icon-btn" onClick={() => { setNotifOpen(o => !o); setProfileOpen(false); markRead(); }}>
                <Bell size={20} />
                {unread > 0 && <span style={{ position: 'absolute', top: '6px', right: '6px', width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} />}
              </button>
              {notifOpen && (
                <div className="glass dropdown" style={{ width: '280px' }}>
                  <div style={{ padding: '0.6rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', fontWeight: 600, fontSize: '0.9rem' }}>Notifications</div>
                  {(notifs || []).map(n => (
                    <div key={n.id} style={{ padding: '0.6rem 1rem', fontSize: '0.875rem', opacity: n.read ? 0.5 : 1, cursor: 'pointer', borderRadius: '0.5rem' }}>
                      {n.text} <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>· {n.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Theme */}
            <button className="icon-btn" onClick={onToggleTheme} title="Toggle theme">
              {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {/* Profile dropdown */}
            <div style={{ position: 'relative' }}>
              <button 
                onMouseEnter={() => { setProfileOpen(true); setNotifOpen(false); }}
                onClick={() => navigate('/profile')}
                style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid rgba(45,212,191,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', padding: 0, background: 'rgba(20,184,166,0.15)' }}>
                {profile?.avatar ? (
                  <img src={profile.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--teal-500), var(--violet-500))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>
                    {isGuest ? 'GU' : (profile?.name ? profile.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : <User size={16} style={{ color: 'var(--teal-400)' }} />)}
                  </div>
                )}
              </button>
              {profileOpen && (
                <div className="glass dropdown" style={{ width: '200px' }} onMouseLeave={() => setProfileOpen(false)}>
                  <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ fontWeight: 600 }}>{isGuest ? 'Guest User' : (profile?.name || 'User')}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)', fontFamily: 'var(--font-mono)' }}>
                      {isGuest ? 'Guest Mode' : (profile?.path || '').split(' → ').pop()}
                    </div>
                  </div>
                  <Link to="/profile" className="dropdown-item" onClick={() => setProfileOpen(false)}>View Profile</Link>
                  <Link to="/profile" className="dropdown-item" onClick={() => setProfileOpen(false)}>My Posts</Link>
                  <Link to="/settings" className="dropdown-item" onClick={() => setProfileOpen(false)}>Settings</Link>
                  <button className="dropdown-item" style={{ color: '#f87171', width: '100%', textAlign: 'left', background: 'none', border: 'none', fontFamily: 'inherit', fontSize: '0.9rem' }} onClick={handleLogout}>Sign Out</button>
                </div>
              )}
            </div>

            {/* Mobile hamburger */}
            <button className="icon-btn show-only-mobile" onClick={() => setMobileOpen(o => !o)}>
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="glass" style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            {navLinks.map(l => (
              <Link key={l.to} to={l.to} style={{ fontWeight: 500, textDecoration: 'none', color: 'inherit' }} onClick={() => setMobileOpen(false)}>{l.label}</Link>
            ))}
            <Link to="/post" style={{ fontWeight: 500, textDecoration: 'none', color: 'var(--teal-400)' }} onClick={() => setMobileOpen(false)}>Create Post</Link>
            <Link to="/profile" style={{ fontWeight: 500, textDecoration: 'none', color: 'var(--teal-400)' }} onClick={() => setMobileOpen(false)}>Profile</Link>
            <Link to="/settings" style={{ fontWeight: 500, textDecoration: 'none', color: 'inherit' }} onClick={() => setMobileOpen(false)}>Settings</Link>
            <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#f87171', fontWeight: 600, textAlign: 'left', padding: 0, fontFamily: 'inherit', fontSize: '1rem' }}>Sign Out</button>
          </div>
        )}
      </nav>

      <style>{`
        .icon-btn { background: none; border: none; color: inherit; padding: 0.5rem; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
        .icon-btn:hover { background: rgba(255,255,255,0.1); color: var(--teal-400); }
        .dropdown { position: absolute; right: 0; top: calc(100% + 0.5rem); border-radius: 0.75rem; box-shadow: 0 8px 32px rgba(0,0,0,0.3); padding: 0.4rem; z-index: 300; }
        .dropdown-item { display: block; padding: 0.5rem 0.75rem; border-radius: 0.4rem; text-decoration: none; color: inherit; font-size: 0.9rem; }
        .dropdown-item:hover { background: rgba(255,255,255,0.08); border-left: 2px solid var(--teal-400); padding-left: calc(0.75rem - 2px); }
        .hide-mobile { display: flex; }
        .show-only-mobile { display: none; }
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
          .show-only-mobile { display: flex !important; }
        }
      `}</style>
    </>
  )
}
