import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, Lock, Save } from 'lucide-react';
import api from '../../utils/api';

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', currentPassword: '', newPassword: '' });
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(user?.avatar || null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true); setMsg({ text: '', type: '' });
    
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('phone', form.phone);
    if (form.currentPassword) formData.append('currentPassword', form.currentPassword);
    if (form.newPassword) formData.append('newPassword', form.newPassword);
    if (avatar) formData.append('avatar', avatar);

    try {
      const { data } = await api.put('/users/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUser(data.user);
      setMsg({ text: 'Profile updated successfully!', type: 'success' });
      setForm(f => ({ ...f, currentPassword: '', newPassword: '' }));
    } catch (err) {
      setMsg({ text: err.response?.data?.message || 'Update failed', type: 'error' });
    } finally { setLoading(false); }
  };

  return (
    <div style={{ paddingTop: 72, minHeight: '100vh', background: 'var(--bg-page)', paddingBottom: 60, transition: 'all 0.3s' }}>
      <style>{`
        .profile-header { display: flex; alignItems: center; gap: 32px; }
        .profile-form-grid { display: grid; gridTemplateColumns: 1fr 1fr; gap: 16px; }
        
        @media (max-width: 600px) {
          .profile-header { flex-direction: column; text-align: center; gap: 20px; }
          .profile-form-grid { grid-template-columns: 1fr !important; }
          .profile-card { padding: 24px !important; }
        }
      `}</style>
      
      <div style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #0a2540 100%)', padding: '60px 0 68px' }}>
        <div className="container profile-header" style={{ padding: '0 24px' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ width: 120, height: 120, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '4px solid rgba(255,255,255,0.2)', margin: '0 auto' }}>
              {preview ? (
                <img src={preview} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: 48, fontWeight: 700, color: 'var(--primary)' }}>{user?.name?.charAt(0)}</span>
              )}
            </div>
            <label style={{ position: 'absolute', bottom: 4, right: 4, width: 36, height: 36, background: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '3px solid var(--primary)', boxShadow: 'var(--shadow)' }}>
              <Save size={16} color="var(--primary)"/>
              <input type="file" onChange={handleAvatarChange} style={{ display: 'none' }} accept="image/*" />
            </label>
          </div>
          <div>
            <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2.2rem, 5vw, 2.8rem)', color: 'white', marginBottom: 4, fontWeight: 700 }}>{user?.name}</h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16 }}>{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 36, maxWidth: 640, padding: '36px 16px' }}>
        <div className="profile-card" style={{ background: 'var(--bg-card)', borderRadius: 24, padding: 40, boxShadow: 'var(--shadow)', border: '1px solid var(--border-color)' }}>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)', marginBottom: 24, fontFamily: 'Cormorant Garamond, serif', fontWeight: 700 }}>Profile Settings</h2>

          {msg.text && (
            <div style={{ background: msg.type === 'success' ? '#d1fae5' : '#fee2e2', color: msg.type === 'success' ? '#065f46' : '#991b1b', padding: '14px 20px', borderRadius: 12, marginBottom: 24, fontSize: 14, fontWeight: 600 }}>
              {msg.type === 'success' ? '✓ ' : '✕ '}{msg.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="profile-form-grid">
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }}/>
                  <input className="form-input" style={{ paddingLeft: 42 }} value={form.name} onChange={e => setForm({...form, name: e.target.value})}/>
                </div>
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Mobile</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }}/>
                  <input className="form-input" style={{ paddingLeft: 42 }} value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}/>
                </div>
              </div>
            </div>
            <div className="form-group" style={{ marginTop: 20 }}>
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }}/>
                <input className="form-input" style={{ paddingLeft: 42, background: 'var(--gray-100)', color: 'var(--text-muted)' }} value={user?.email} readOnly/>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', margin: '32px 0', padding: '32px 0 0' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700 }}><Lock size={16} color="var(--accent)"/> Update Password</h3>
              <div className="profile-form-grid">
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Current Password</label>
                  <input className="form-input" type="password" value={form.currentPassword} onChange={e => setForm({...form, currentPassword: e.target.value})} placeholder="Required to change"/>
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">New Password</label>
                  <input className="form-input" type="password" value={form.newPassword} onChange={e => setForm({...form, newPassword: e.target.value})} placeholder="Min. 6 chars"/>
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: 32, padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              {loading ? <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }}/> : <><Save size={18}/> Save Profile Changes</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
