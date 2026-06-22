import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const userStr = params.get('user');

    if (token && userStr) {
      try {
        const userData = JSON.parse(decodeURIComponent(userStr));
        loginWithToken(token, userData);
        navigate('/', { replace: true });
      } catch (err) {
        console.error('Auth callback error:', err);
        navigate('/login?error=callback_failed', { replace: true });
      }
    } else {
      navigate('/login?error=no_token', { replace: true });
    }
  }, [navigate, loginWithToken]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '16px' }}>
      <div style={{ fontSize: '40px' }}>🔄</div>
      <p style={{ color: '#666', fontSize: '18px' }}>Completing login with Google...</p>
    </div>
  );
}
