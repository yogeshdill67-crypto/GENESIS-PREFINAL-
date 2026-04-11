import { useEffect, useState } from 'react'

let toastId = 0
const listeners = new Set()

export function showToast(msg, type = 'success') {
  const id = ++toastId
  listeners.forEach(fn => fn({ id, msg, type }))
  setTimeout(() => listeners.forEach(fn => fn({ id, remove: true })), 3200)
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    const fn = (t) => {
      if (t.remove) setToasts(prev => prev.filter(x => x.id !== t.id))
      else setToasts(prev => [...prev, t])
    }
    listeners.add(fn)
    return () => listeners.delete(fn)
  }, [])

  return (
    <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '0.5rem', pointerEvents: 'none' }}>
      {toasts.map(t => (
        <div key={t.id} className="glass" style={{
          padding: '0.65rem 1.2rem',
          borderRadius: '0.75rem',
          borderLeft: `3px solid ${t.type === 'success' ? 'var(--teal-400)' : '#ef4444'}`,
          color: t.type === 'success' ? 'var(--teal-400)' : '#f87171',
          fontSize: '0.9rem',
          fontWeight: 500,
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
          animation: 'fadeInUp 0.3s forwards',
          minWidth: '200px',
        }}>
          {t.msg}
        </div>
      ))}
    </div>
  )
}
