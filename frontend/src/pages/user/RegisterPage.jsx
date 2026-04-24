import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Globe, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const { registerUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]  = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) return setError('Passwords do not match');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true);
    try {
      await registerUser({ name: form.name, email: form.email, phone: form.phone, password: form.password });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  const set = k => e => setForm({ ...form, [k]: e.target.value });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--sand)', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 480, animation: 'fadeIn 0.5s ease' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 20 }}>
            <div style={{ width: 40, height: 40, background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Globe size={22} color="var(--accent)"/>
            </div>
            <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 24, fontWeight: 600, color: 'var(--primary)' }}>Vista<span style={{ color: 'var(--accent)' }}>Voyage</span></span>
          </Link>
          <h2 style={{ fontSize: '2rem', color: 'var(--primary)' }}>Create Account</h2>
          <p style={{ color: 'var(--gray-600)', marginTop: 6 }}>Already have one? <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link></p>
        </div>

        <div style={{ background: 'white', borderRadius: 20, padding: 36, boxShadow: 'var(--shadow-lg)' }}>
          {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '12px 16px', borderRadius: 8, marginBottom: 20, fontSize: 14 }}>{error}</div>}
          <form onSubmit={handleSubmit}>
            {[
              { key: 'name',    label: 'Full Name',     type: 'text',  placeholder: 'John Doe' },
              { key: 'email',   label: 'Email Address', type: 'email', placeholder: 'you@example.com' },
              { key: 'phone',   label: 'Mobile Number', type: 'tel',   placeholder: '+91 98765 43210' },
            ].map(f => (
              <div className="form-group" key={f.key}>
                <label className="form-label">{f.label}</label>
                <input className="form-input" type={f.type} value={form[f.key]} onChange={set(f.key)} placeholder={f.placeholder} required />
              </div>
            ))}
            <div className="form-group" style={{ position: 'relative' }}>
              <label className="form-label">Password</label>
              <input className="form-input" type={showPw ? 'text' : 'password'} value={form.password} onChange={set('password')} placeholder="Min. 6 characters" required style={{ paddingRight: 44 }} />
              <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 14, top: 38, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)' }}>
                {showPw ? <EyeOff size={18}/> : <Eye size={18}/>}
              </button>
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input className="form-input" type="password" value={form.confirm} onChange={set('confirm')} placeholder="Repeat password" required />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: 16 }}>
              {loading ? <div className="spinner" style={{ width: 22, height: 22, borderWidth: 2 }}/> : <><span>Create Account</span><ArrowRight size={18}/></>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
