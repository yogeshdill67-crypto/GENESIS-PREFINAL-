import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import ToastContainer from './components/Toast'
import Home from './pages/Home'
import Explore from './pages/Explore'
import Network from './pages/Network'
import Communities from './pages/Communities'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import Login from './pages/Login'
import CareerAdvisor from './pages/CareerAdvisor'
import CreatePostPage from './pages/CreatePostPage'
import Messages from './pages/Messages'
import AIChatbot from './components/AIChatbot'
import { getTheme, saveTheme, isLoggedIn, getProfile, getPosts, getAuth } from './data/store'

function ProtectedRoute({ children }) {
  return isLoggedIn() ? children : <Navigate to="/login" replace />
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: '#fff', padding: '2rem', textAlign: 'center' }}>
          <h2 style={{ color: '#f87171' }}>Something went wrong.</h2>
          <p style={{ color: '#94a3b8', margin: '1rem 0' }}>The application encountered an unexpected error, likely due to malformed local data.</p>
          <button 
            onClick={() => { localStorage.clear(); window.location.href = '/'; }}
            style={{ padding: '0.75rem 1.5rem', background: 'var(--teal-500)', border: 'none', borderRadius: '0.5rem', color: '#000', fontWeight: 700, cursor: 'pointer' }}
          >
            Reset Application Data
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [theme, setTheme] = useState(getTheme)
  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])
  const [isGuest, setIsGuest] = useState(false)
  const location = useLocation()

  useEffect(() => {
    async function init() {
      const auth = getAuth()
      // Detect guest: explicit flag, or legacy demo account
      let guestDetected = !!auth?.isGuest || auth?.email === 'guest@genesis.app'
      
      // Auto-patch: if this is Alex Dev, strip the guest flag if it was accidentally added.
      if (auth?.email === 'alex@genesis.app' || auth?.name === 'Alex Dev') {
        guestDetected = false
        if (auth?.isGuest) {
          const newAuth = { ...auth }
          delete newAuth.isGuest
          localStorage.setItem('g_auth', JSON.stringify(newAuth))
        }
      } else if (guestDetected && !auth?.isGuest && auth) {
        // Auto-patch actual guests
        localStorage.setItem('g_auth', JSON.stringify({ ...auth, isGuest: true }))
      }

      
      setIsGuest(guestDetected)
      const [p, ps] = await Promise.all([getProfile(), getPosts()])
      setProfile(p)
      setPosts(ps)
    }
    init()
  }, [location.pathname])

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.remove('light-mode')
    } else {
      document.body.classList.add('light-mode')
    }
  }, [theme])

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    saveTheme(next)
  }

  const hideNav = location.pathname === '/login'
  const isProfileIncomplete = !hideNav && profile && !profile.path

  return (
    <ErrorBoundary>
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      {!hideNav && (
        <Navbar theme={theme} onToggleTheme={toggleTheme} profile={profile} posts={posts} isGuest={isGuest} />
      )}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/advisor" element={<ProtectedRoute><CareerAdvisor /></ProtectedRoute>} />
        <Route path="/" element={<ProtectedRoute><Home isGuest={isGuest} /></ProtectedRoute>} />
        <Route path="/network" element={<ProtectedRoute><Network /></ProtectedRoute>} />
        <Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
        <Route path="/communities" element={<ProtectedRoute><Communities /></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile isGuest={isGuest} /></ProtectedRoute>} />
        <Route path="/profile/:username" element={<ProtectedRoute><Profile isGuest={isGuest} /></ProtectedRoute>} />
        <Route path="/post" element={<ProtectedRoute><CreatePostPage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings theme={theme} onToggleTheme={toggleTheme} /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <AIChatbot />
      <ToastContainer />
    </ErrorBoundary>
  )
}
