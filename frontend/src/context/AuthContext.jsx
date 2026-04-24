import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [admin,   setAdmin]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('vv_token');
    const role  = localStorage.getItem('vv_role');
    if (!token) { setLoading(false); return; }
    if (role === 'user') {
      api.get('/auth/me')
        .then(r => setUser(r.data.user))
        .catch(() => { localStorage.removeItem('vv_token'); localStorage.removeItem('vv_role'); })
        .finally(() => setLoading(false));
    } else if (role === 'admin') {
      api.get('/auth/admin/me')
        .then(r => setAdmin(r.data.admin))
        .catch(() => { localStorage.removeItem('vv_token'); localStorage.removeItem('vv_role'); })
        .finally(() => setLoading(false));
    } else { setLoading(false); }
  }, []);

  const loginUser = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('vv_token', data.token);
    localStorage.setItem('vv_role',  'user');
    setUser(data.user);
    return data;
  };

  const registerUser = async (form) => {
    const { data } = await api.post('/auth/register', form);
    localStorage.setItem('vv_token', data.token);
    localStorage.setItem('vv_role',  'user');
    setUser(data.user);
    return data;
  };

  const loginAdmin = async (email, password) => {
    const { data } = await api.post('/auth/admin/login', { email, password });
    localStorage.setItem('vv_token', data.token);
    localStorage.setItem('vv_role',  'admin');
    setAdmin(data.admin);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('vv_token');
    localStorage.removeItem('vv_role');
    setUser(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ user, admin, loading, loginUser, registerUser, loginAdmin, logout, setUser, setAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
