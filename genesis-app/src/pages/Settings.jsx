import { useState } from 'react'
import { getProfile, saveProfile, getTheme, saveTheme } from '../data/store'
import { showToast } from '../components/Toast'
import { Sun, Moon, Bell, Lock, Trash2, Download, ChevronRight } from 'lucide-react'

export default function Settings({ theme, onToggleTheme }) {
  const [profile, setProfile] = useState(getProfile)
  const [notifications, setNotifications] = useState({ likes: true, comments: true, newPaths: true, community: false })
  const [privacy, setPrivacy] = useState({ publicProfile: true, showEmail: false })

  function Toggle({ value, onChange }) {
    return (
      <button onClick={() => onChange(!value)} style={{
        width: '46px', height: '26px', borderRadius: '13px', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.3s',
        background: value ? 'var(--teal-500)' : 'rgba(255,255,255,0.1)'
      }}>
        <div style={{ position: 'absolute', top: '3px', left: value ? '23px' : '3px', width: '20px', height: '20px', borderRadius: '50%', background: '#fff', transition: 'left 0.3s' }} />
      </button>
    )
  }

  function Section({ title, icon, children }) {
    return (
      <div className="glass" style={{ borderRadius: '1rem', padding: '1.5rem', marginBottom: '1rem' }}>
        <h3 style={{ margin: '0 0 1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
          {icon} {title}
        </h3>
        {children}
      </div>
    )
  }

  function Row({ label, desc, right }) {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div>
          <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{label}</div>
          {desc && <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.15rem' }}>{desc}</div>}
        </div>
        {right}
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '1.5rem', paddingTop: '5rem' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1.5rem' }}>Settings</h1>

      {/* Appearance */}
      <Section title="Appearance" icon={theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}>
        <Row label="Theme" desc={`Currently ${theme} mode`}
          right={
            <button onClick={onToggleTheme} style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem', borderRadius: '0.5rem',
              background: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
              border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', color: 'inherit', fontWeight: 600, fontSize: '0.85rem'
            }}>
              {theme === 'dark' ? <><Moon size={14}/> Dark</> : <><Sun size={14}/> Light</>}
            </button>
          }
        />
      </Section>

      {/* Notifications */}
      <Section title="Notifications" icon={<Bell size={18} />}>
        {[
          { key: 'likes', label: 'Likes on your posts', desc: 'Get notified when someone likes your post' },
          { key: 'comments', label: 'Comments', desc: 'Get notified on new comments' },
          { key: 'newPaths', label: 'New Career Paths', desc: 'Updates when new paths are added' },
          { key: 'community', label: 'Community Updates', desc: 'Activity in communities you joined' },
        ].map(item => (
          <Row key={item.key} label={item.label} desc={item.desc}
            right={<Toggle value={notifications[item.key]} onChange={v => setNotifications(n => ({ ...n, [item.key]: v }))} />}
          />
        ))}
      </Section>

      {/* Privacy */}
      <Section title="Privacy & Account" icon={<Lock size={18} />}>
        {[
          { key: 'publicProfile', label: 'Public Profile', desc: 'Allow others to view your profile' },
          { key: 'showEmail', label: 'Show Email', desc: 'Display your email on your profile' },
        ].map(item => (
          <Row key={item.key} label={item.label} desc={item.desc}
            right={<Toggle value={privacy[item.key]} onChange={v => setPrivacy(p => ({ ...p, [item.key]: v }))} />}
          />
        ))}
      </Section>

      {/* Data */}
      <Section title="Data" icon={<Download size={18} />}>
        <Row label="Export My Data" desc="Download all your posts and activity" right={
          <button onClick={() => {
            const data = { profile, posts: JSON.parse(localStorage.getItem('g_posts') || '[]') }
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a'); a.href = url; a.download = 'genesis-data.json'; a.click()
            showToast('Data exported!')
          }} style={{ padding: '0.35rem 0.9rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.15)', background: 'none', color: 'inherit', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Download size={14}/> Export
          </button>
        } />
        <Row label="Clear Feed Cache" desc="Reset your locally cached posts" right={
          <button onClick={() => { localStorage.removeItem('g_posts'); showToast('Cache cleared'); }} style={{ padding: '0.35rem 0.9rem', borderRadius: '0.5rem', border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)', color: '#f87171', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Trash2 size={14}/> Clear
          </button>
        } />
      </Section>

      {/* App version */}
      <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.78rem', marginTop: '1rem' }}>
        GENESIS v2.0.0 · Built with ❤️ · Career & Domain Platform
      </div>
    </div>
  )
}
