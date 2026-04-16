import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNetwork, saveNetwork } from '../data/store';
import { UserPlus, UserCheck, X, Clock } from 'lucide-react';
import { showToast } from '../components/Toast';

export function NetworkCard({ person, onAction, actionLabel, actionIcon, secondaryAction, secondaryLabel, secondaryIcon }) {
  const navigate = useNavigate();
  const initials = person.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  return (
    <div className="glass fade-in-up" onClick={() => navigate('/profile/' + person.name)} style={{ borderRadius: '1rem', padding: '1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative', cursor: 'pointer' }}>
      <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--slate-700), var(--slate-800))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '1rem', border: '2px solid rgba(255,255,255,0.1)' }}>
        {initials}
      </div>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.25rem' }}>{person.name}</h3>
      <p style={{ fontSize: '0.8rem', color: 'var(--slate-400)', minHeight: '40px', margin: '0 0 1rem' }}>{person.path}</p>
      {person.mutual > 0 && <p style={{ fontSize: '0.75rem', color: 'var(--teal-400)', margin: '0 0 1rem' }}>{person.mutual} mutual connections</p>}
      
      <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
        {secondaryAction && (
          <button onClick={(e) => { e.stopPropagation(); secondaryAction(person.id); }} style={{ flex: 1, padding: '0.5rem', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', justifyContent: 'center', borderRadius: '0.5rem', cursor: 'pointer', display: 'flex', gap: '0.4rem', alignItems: 'center', fontSize: '0.8rem' }}>
            {secondaryIcon} {secondaryLabel}
          </button>
        )}
        <button onClick={(e) => { e.stopPropagation(); onAction(person.id); }} style={{ flex: 1, padding: '0.5rem', background: 'var(--teal-500)', color: '#000', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', display: 'flex', gap: '0.4rem', justifyContent: 'center', alignItems: 'center', fontSize: '0.8rem', fontWeight: 700 }}>
          {actionIcon} {actionLabel}
        </button>
      </div>
    </div>
  )
}

export default function Network() {
  const [network, setNetwork] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      const net = await getNetwork();
      setNetwork(net || []);
    }
    load();
  }, []);

  const pending = network.filter(n => n.status === 'pending');
  const suggested = network.filter(n => n.status === 'suggested');
  const connected = network.filter(n => n.status === 'connected');
  const sent = network.filter(n => n.status === 'sent');

  function handleAccept(id) {
    const updated = network.map(n => n.id === id ? { ...n, status: 'connected' } : n);
    setNetwork(updated); saveNetwork(updated); showToast('Connection accepted \u2713');
  }

  function handleDecline(id) {
    const updated = network.filter(n => n.id !== id);
    setNetwork(updated); saveNetwork(updated); showToast('Request ignored');
  }

  function handleConnect(id) {
    const updated = network.map(n => n.id === id ? { ...n, status: 'sent' } : n);
    setNetwork(updated); saveNetwork(updated); showToast('Connection request sent \u2713');
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '1.5rem', paddingTop: '5rem' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '2rem' }}>My Network</h1>

      {pending.length > 0 && (
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.2rem', color: '#94a3b8', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>Pending Requests</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
            {pending.map(p => (
              <NetworkCard key={p.id} person={p} onAction={handleAccept} actionLabel="Accept" actionIcon={<UserCheck size={16}/>} secondaryAction={handleDecline} secondaryLabel="Ignore" secondaryIcon={<X size={16}/>} />
            ))}
          </div>
        </div>
      )}

      {suggested.length > 0 && (
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.2rem', color: '#94a3b8', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>Suggested for you</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
            {suggested.map(p => (
              <NetworkCard key={p.id} person={p} onAction={handleConnect} actionLabel="Connect" actionIcon={<UserPlus size={16}/>} />
            ))}
          </div>
        </div>
      )}

      {sent.length > 0 && (
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.2rem', color: '#94a3b8', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>Sent Requests</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
            {sent.map(p => (
              <div key={p.id} className="glass" style={{ padding: '1rem', borderRadius: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div><strong style={{ fontSize: '0.9rem' }}>{p.name}</strong><br/><span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>Request Pending</span></div>
                <Clock size={16} color="var(--slate-400)"/>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.2rem', color: '#94a3b8', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>My Connections ({connected.length})</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {connected.length === 0 ? <p style={{ color: 'var(--slate-400)' }}>You have no connections yet.</p> : connected.map(p => (
            <div key={p.id} className="glass" style={{ padding: '1rem', borderRadius: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--teal-500), var(--violet-500))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#fff' }}>
                  {p.name[0]}
                </div>
                <div><strong style={{ fontSize: '1rem' }}>{p.name}</strong><br/><span style={{ fontSize: '0.8rem', color: 'var(--slate-400)' }}>{p.path}</span></div>
              </div>
              <button onClick={() => navigate('/messages', { state: { contactId: p.id } })} style={{ padding: '0.4rem 1rem', background: 'transparent', border: '1px solid var(--teal-400)', color: 'var(--teal-400)', borderRadius: '99px', cursor: 'pointer', fontSize: '0.8rem' }}>Message</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
