import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { login, CAREER_CATEGORIES } from '../data/store'
import { showToast } from '../components/Toast'
import { Eye, EyeOff, User, Lock, Sparkles, Briefcase } from 'lucide-react'

export default function Login() {
  const location = useLocation()
  const navigate = useNavigate()
  const [tab, setTab] = useState(location.state?.tab || 'login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (!email || !password) { showToast('Fill in all fields', 'error'); return }
    setLoading(true)
    setTimeout(() => {
      const isSignup = tab === 'signup'
      login({ name: name || email.split('@')[0], email, isSignup })
      showToast(isSignup ? 'Account created successfully! 🚀' : 'Welcome back to GENESIS! 🚀')
      navigate(isSignup ? '/advisor' : '/')
      setLoading(false)
    }, 900)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', position: 'relative' }}>
      {/* Background orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      {/* Card */}
      <div className="glass fade-in-up" style={{ width: '100%', maxWidth: '400px', borderRadius: '1.5rem', padding: '2.5rem', boxShadow: '0 24px 64px rgba(0,0,0,0.4)' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--teal-400)', letterSpacing: '0.12em', textShadow: '0 0 20px rgba(45,212,191,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <Sparkles size={22} /> GENESIS
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.4rem' }}>Career & Domain Platform</p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '0.75rem', padding: '0.25rem', marginBottom: '1.75rem' }}>
          {['login', 'signup'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: '0.45rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', textTransform: 'capitalize', transition: 'all 0.2s',
              background: tab === t ? 'var(--teal-500)' : 'transparent',
              color: tab === t ? '#000' : '#94a3b8'
            }}>{t === 'login' ? 'Sign In' : 'Sign Up'}</button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {tab === 'signup' && (
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input className="inp" style={{ paddingLeft: '2.4rem' }} placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} />
            </div>
          )}

          <div style={{ position: 'relative' }}>
            <User size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input className="inp" type="email" style={{ paddingLeft: '2.4rem' }} placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input className="inp" type={showPw ? 'text' : 'password'} style={{ paddingLeft: '2.4rem', paddingRight: '2.5rem' }} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
            <button type="button" onClick={() => setShowPw(o => !o)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}>
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          {tab === 'login' && (
            <div style={{ textAlign: 'right', marginTop: '-0.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--teal-400)', cursor: 'pointer' }}>Forgot password?</span>
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            padding: '0.7rem', background: 'var(--teal-500)', color: '#000', border: 'none', borderRadius: '0.6rem',
            fontWeight: 700, fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.8 : 1, transition: 'all 0.2s', marginTop: '0.25rem',
            position: 'relative', overflow: 'hidden'
          }}>
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <span style={{ width: '16px', height: '16px', border: '2px solid rgba(0,0,0,0.3)', borderTop: '2px solid #000', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                {tab === 'login' ? 'Signing in…' : 'Creating account…'}
              </span>
            ) : tab === 'login' ? 'Sign In' : 'Create Account'}
          </button>

          <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.8rem', marginTop: '0.25rem' }}>
            {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <span style={{ color: 'var(--teal-400)', cursor: 'pointer', fontWeight: 600 }} onClick={() => setTab(tab === 'login' ? 'signup' : 'login')}>
              {tab === 'login' ? 'Sign up' : 'Sign in'}
            </span>
          </div>
        </form>

        {/* Demo bypass */}
        <button onClick={() => { login({ name: 'Guest User', email: 'guest@genesis.app', isGuest: true }); navigate('/') }}
          style={{ width: '100%', marginTop: '1.25rem', padding: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.6rem', color: '#94a3b8', cursor: 'pointer', fontSize: '0.8rem' }}>
          👁️ Continue as Guest
        </button>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
