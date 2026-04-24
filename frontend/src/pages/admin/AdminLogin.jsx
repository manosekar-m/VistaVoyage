import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Globe, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export default function AdminLogin() {
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await loginAdmin(form.email, form.password);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid admin credentials');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -120, right: -120, width: 400, height: 400, background: 'rgba(201,168,76,0.08)', borderRadius: '50%' }}/>
      <div style={{ position: 'absolute', bottom: -80, left: -80, width: 300, height: 300, background: 'rgba(201,168,76,0.05)', borderRadius: '50%' }}/>

      <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ width: 64, height: 64, background: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <ShieldCheck size={32} color="var(--primary)"/>
          </div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.2rem', color: 'white' }}>Admin Portal</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: 6, fontSize: 14 }}>VistaVoyage Administration</p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 36 }}>
          <div style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 10, padding: '10px 14px', marginBottom: 24, fontSize: 13, color: 'rgba(255,255,255,0.65)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Lock size={13} color="var(--accent)"/>
            Default: admin@vistavoyage.com / Admin@123
          </div>

          {error && <div style={{ background: 'rgba(239,68,68,0.15)', color: '#fca5a5', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 14 }}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.65)', marginBottom: 6 }}>Email</label>
              <input style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, color: 'white', fontSize: 15, fontFamily: 'DM Sans', outline: 'none', boxSizing: 'border-box' }}
                type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="admin@vistavoyage.com" required
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}/>
            </div>
            <div className="form-group" style={{ position: 'relative' }}>
              <label style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.65)', marginBottom: 6 }}>Password</label>
              <input style={{ width: '100%', padding: '12px 44px 12px 16px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, color: 'white', fontSize: 15, fontFamily: 'DM Sans', outline: 'none', boxSizing: 'border-box' }}
                type={showPw ? 'text' : 'password'} value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="••••••••" required
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}/>
              <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 14, top: 36, background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)' }}>
                {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
              </button>
            </div>
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: 'var(--accent)', border: 'none', borderRadius: 10, color: 'var(--primary)', fontSize: 16, fontWeight: 600, cursor: loading ? 'wait' : 'pointer', fontFamily: 'DM Sans', marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'opacity 0.2s' }}>
              {loading ? <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2, borderTopColor: 'var(--primary)' }}/> : <><ShieldCheck size={16}/> Sign In as Admin</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
