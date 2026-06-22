import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const GOOGLE_AUTH_URL = 'http://localhost:5000/api/auth/google';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = GOOGLE_AUTH_URL;
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
      <div style={{ width: '100%', maxWidth: '420px', margin: '20px', backgroundColor: 'white', borderRadius: '20px', padding: '40px', boxShadow: '0 25px 60px rgba(0,0,0,0.3)' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '36px', marginBottom: '8px' }}>✈️</div>
          <h1 style={{ margin: 0, fontSize: '26px', color: '#1a1a2e', fontWeight: '800' }}>Welcome Back</h1>
          <p style={{ color: '#888', marginTop: '6px', fontSize: '14px' }}>Sign in to your VistaVoyage account</p>
        </div>

        {error && (
          <div style={{ padding: '12px 16px', backgroundColor: '#f8d7da', border: '1px solid #f5c6cb', borderRadius: '8px', color: '#721c24', marginBottom: '20px', fontSize: '14px' }}>
            {error}
          </div>
        )}

        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          style={{ width: '100%', padding: '12px', border: '2px solid #e0e0e0', borderRadius: '10px', backgroundColor: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '20px', fontSize: '15px', fontWeight: '600', color: '#333', transition: 'all 0.2s' }}
          onMouseEnter={e => e.target.style.borderColor = '#4285f4'}
          onMouseLeave={e => e.target.style.borderColor = '#e0e0e0'}
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285f4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
            <path fill="#34a853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
            <path fill="#fbbc05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/>
            <path fill="#ea4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.31z"/>
          </svg>
          Continue with Google
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#e0e0e0' }}></div>
          <span style={{ color: '#aaa', fontSize: '13px' }}>or sign in with email</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#e0e0e0' }}></div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#333', fontSize: '14px' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
              style={{ width: '100%', padding: '12px', border: '2px solid #e0e0e0', borderRadius: '10px', fontSize: '15px', outline: 'none', transition: 'border 0.2s', boxSizing: 'border-box' }}
              onFocus={e => e.target.style.borderColor = '#007bff'}
              onBlur={e => e.target.style.borderColor = '#e0e0e0'}
            />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#333', fontSize: '14px' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              style={{ width: '100%', padding: '12px', border: '2px solid #e0e0e0', borderRadius: '10px', fontSize: '15px', outline: 'none', transition: 'border 0.2s', boxSizing: 'border-box' }}
              onFocus={e => e.target.style.borderColor = '#007bff'}
              onBlur={e => e.target.style.borderColor = '#e0e0e0'}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '13px', background: 'linear-gradient(135deg, #007bff, #0056b3)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', color: '#666', fontSize: '14px' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#007bff', fontWeight: '600', textDecoration: 'none' }}>Register here</Link>
        </p>
      </div>
    </div>
  );
}
