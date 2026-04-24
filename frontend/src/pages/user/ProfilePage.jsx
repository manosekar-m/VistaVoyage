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
    <div style={{ paddingTop: 80, minHeight: '100vh', background: 'var(--bg-page)', paddingBottom: 60, transition: 'all 0.3s' }}>
      <div style={{ background: 'var(--primary)', padding: '60px 0 68px' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <div style={{ position: 'relative' }}>
            <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '4px solid rgba(255,255,255,0.2)' }}>
              {preview ? (
                <img src={preview} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: 40, fontWeight: 700, color: 'var(--primary)' }}>{user?.name?.charAt(0)}</span>
              )}
            </div>
            <label style={{ position: 'absolute', bottom: 0, right: 0, width: 32, height: 32, background: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '2px solid var(--primary)' }}>
              <Save size={14} color="var(--primary)"/>
              <input type="file" onChange={handleAvatarChange} style={{ display: 'none' }} accept="image/*" />
            </label>
          </div>
          <div>
            <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', color: 'white', marginBottom: 4 }}>{user?.name}</h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16 }}>{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 36, maxWidth: 600 }}>
        <div style={{ background: 'var(--bg-card)', borderRadius: 20, padding: 36, boxShadow: 'var(--shadow)', border: '1px solid var(--border-color)' }}>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--text-main)', marginBottom: 24 }}>Edit Profile</h2>

          {msg.text && (
            <div style={{ background: msg.type === 'success' ? '#d1fae5' : '#fee2e2', color: msg.type === 'success' ? '#065f46' : '#991b1b', padding: '12px 16px', borderRadius: 8, marginBottom: 20, fontSize: 14 }}>
              {msg.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }}/>
                  <input className="form-input" style={{ paddingLeft: 36 }} value={form.name} onChange={e => setForm({...form, name: e.target.value})}/>
                </div>
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Mobile</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }}/>
                  <input className="form-input" style={{ paddingLeft: 36 }} value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}/>
                </div>
              </div>
            </div>
            <div className="form-group" style={{ marginTop: 16 }}>
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }}/>
                <input className="form-input" style={{ paddingLeft: 36, background: 'var(--gray-50)' }} value={user?.email} readOnly/>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', margin: '24px 0', padding: '24px 0 0' }}>
              <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}><Lock size={15}/> Change Password (optional)</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Current Password</label>
                  <input className="form-input" type="password" value={form.currentPassword} onChange={e => setForm({...form, currentPassword: e.target.value})} placeholder="Current password"/>
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">New Password</label>
                  <input className="form-input" type="password" value={form.newPassword} onChange={e => setForm({...form, newPassword: e.target.value})} placeholder="New password"/>
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {loading ? <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }}/> : <><Save size={16}/> Save Changes</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
