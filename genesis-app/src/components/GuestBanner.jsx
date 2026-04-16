import { useNavigate } from 'react-router-dom'
import { Rocket, Sparkles, Users, TrendingUp, ArrowRight } from 'lucide-react'

export default function GuestBanner() {
  const navigate = useNavigate()

  return (
    <div className="glass fade-in-up" style={{ 
      borderRadius: '1.25rem', 
      padding: '2rem', 
      marginBottom: '1.5rem', 
      background: 'linear-gradient(135deg, rgba(45, 212, 191, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative dots/orbs */}
      <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: 'var(--teal-400)', filter: 'blur(50px)', opacity: 0.2 }}></div>
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ padding: '0.6rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.75rem', color: 'var(--teal-400)' }}>
            <Rocket size={24} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Ready to take the next step?</h2>
        </div>

        <p style={{ color: '#cbd5e1', lineHeight: 1.6, marginBottom: '2rem', maxWidth: '600px' }}>
          You're currently in <strong>Guest Mode</strong>. Register now to fully explore your career path, 
          connect with expert mentors, and unlock personalized insights tailored to your goals.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <Sparkles size={18} className="text-teal" style={{ marginTop: '0.2rem' }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.2rem' }}>Smart Matcher</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>AI-powered career path analysis</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <Users size={18} className="text-teal" style={{ marginTop: '0.2rem' }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.2rem' }}>Mentor Network</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Connect with industry leaders</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <TrendingUp size={18} className="text-teal" style={{ marginTop: '0.2rem' }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.2rem' }}>Market Trends</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Real-time growth & salary data</div>
            </div>
          </div>
        </div>

        <button 
          onClick={() => navigate('/login', { state: { tab: 'signup' } })}
          style={{ 
            background: 'var(--teal-500)', border: 'none', color: '#000', 
            padding: '0.75rem 1.5rem', borderRadius: '0.75rem', fontWeight: 800, 
            fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
            boxShadow: '0 4px 15px rgba(20, 184, 166, 0.3)',
            transition: 'all 0.3s'
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(20, 184, 166, 0.4)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 15px rgba(20, 184, 166, 0.3)'; }}
        >
          Register Now <ArrowRight size={18} />
        </button>
      </div>
    </div>
  )
}
