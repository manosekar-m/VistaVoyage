import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, Globe, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await loginUser(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg-page)', transition: 'all 0.3s' }}>
      {/* Left panel */}
      <div style={{ flex: 1, background: 'var(--primary)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 60, position: 'relative', overflow: 'hidden' }} className="auth-panel">
        <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, background: 'rgba(201,168,76,0.12)', borderRadius: '50%' }}/>
        <div style={{ position: 'absolute', bottom: -100, left: -60, width: 280, height: 280, background: 'rgba(201,168,76,0.08)', borderRadius: '50%' }}/>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 60 }}>
            <div style={{ width: 40, height: 40, background: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Globe size={22} color="var(--primary)"/>
            </div>
            <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 26, fontWeight: 600, color: 'white' }}>Vista<span style={{ color: 'var(--accent)' }}>Voyage</span></span>
          </Link>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '3.2rem', color: 'white', marginBottom: 16 }}>Welcome<br/>back, explorer.</h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 17, lineHeight: 1.7 }}>Your next adventure is just a login away. Discover breathtaking destinations across incredible India.</p>
          <div style={{ marginTop: 48, display: 'flex', gap: 16 }}>
            {['🏔️ Himalayas', '🌴 Kerala', '🏜️ Rajasthan'].map(d => (
              <div key={d} style={{ background: 'rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: 20, color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>{d}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <div style={{ width: '100%', maxWidth: 420, animation: 'fadeIn 0.5s ease' }}>
          <h2 style={{ fontSize: '2rem', color: 'var(--text-main)', marginBottom: 8 }}>Sign In</h2>
          <p style={{ color: 'var(--gray-600)', marginBottom: 32 }}>Don't have an account? <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>Create one</Link></p>

          {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '12px 16px', borderRadius: 8, marginBottom: 20, fontSize: 14 }}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" required />
            </div>
            <div className="form-group" style={{ position: 'relative' }}>
              <label className="form-label">Password</label>
              <input className="form-input" type={showPw ? 'text' : 'password'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••" required style={{ paddingRight: 44 }} />
              <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 14, top: 38, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)' }}>
                {showPw ? <EyeOff size={18}/> : <Eye size={18}/>}
              </button>
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8, padding: '14px', fontSize: 16 }}>
              {loading ? <div className="spinner" style={{ width: 22, height: 22, borderWidth: 2 }}/> : <><span>Sign In</span><ArrowRight size={18}/></>}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <Link to="/admin/login" style={{ color: 'var(--gray-400)', fontSize: 13, textDecoration: 'none' }}>Agency Login →</Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) { .auth-panel { display: none !important; } }
      `}</style>
    </div>
  );
}
