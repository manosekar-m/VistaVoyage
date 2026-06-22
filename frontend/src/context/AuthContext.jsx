import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    const adminData = localStorage.getItem('adminData');
    if (userData) setUser(JSON.parse(userData));
    if (adminData) setAdmin(JSON.parse(adminData));
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
    localStorage.setItem('userData', JSON.stringify(response.data.user));
    localStorage.setItem('userToken', response.data.token);
    setUser(response.data.user);
  };

  const register = async (formData) => {
    const response = await axios.post('http://localhost:5000/api/auth/register', formData);
    localStorage.setItem('userData', JSON.stringify(response.data.user));
    localStorage.setItem('userToken', response.data.token);
    setUser(response.data.user);
  };

  // Used by Google OAuth callback
  const loginWithToken = (token, userData) => {
    localStorage.setItem('userToken', token);
    localStorage.setItem('userData', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('userToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, admin, loading, login, register, logout, loginWithToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

