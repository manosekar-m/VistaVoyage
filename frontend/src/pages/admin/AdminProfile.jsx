import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Save, Lock, User, Phone, Mail } from 'lucide-react';
import AdminLayout from '../../components/shared/AdminLayout';
import api from '../../utils/api';

export default function AdminProfile() {
  const { admin, setAdmin } = useAuth();
  const [form, setForm] = useState({ name: admin?.name || '', phone: admin?.phone || '', currentPassword: '', newPassword: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true); setMsg({ text: '', type: '' });
    try {
      const { data } = await api.put('/admin/profile', form);
      setAdmin(data.admin);
      setMsg({ text: 'Profile updated successfully!', type: 'success' });
      setForm(f => ({ ...f, currentPassword: '', newPassword: '' }));
    } catch (err) {
      setMsg({ text: err.response?.data?.message || 'Update failed', type: 'error' });
    } finally { setLoading(false); }
  };

  return (
    <AdminLayout>
      <div style={{ padding: 32, maxWidth: 640 }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: '2rem', color: 'var(--text-main)', fontFamily: 'Cormorant Garamond' }}>Admin Profile</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>Manage your account settings</p>
        </div>

        {/* Avatar card */}
        <div style={{ background: 'linear-gradient(135deg, var(--primary), #2a5568)', borderRadius: 20, padding: 28, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ color: 'var(--primary)', fontSize: 28, fontWeight: 700 }}>{admin?.name?.charAt(0)}</span>
          </div>
          <div>
            <div style={{ color: 'white', fontSize: '1.3rem', fontFamily: 'Cormorant Garamond, serif', fontWeight: 600 }}>{admin?.name}</div>
            <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14 }}>{admin?.email}</div>
            <div style={{ color: 'var(--accent)', fontSize: 12, marginTop: 4, fontWeight: 600 }}>Administrator</div>
          </div>
        </div>

        <div style={{ background: 'var(--bg-card)', borderRadius: 20, padding: 32, boxShadow: 'var(--shadow)', border: '1px solid var(--border-color)' }}>
          {msg.text && (
            <div style={{ background: msg.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: msg.type === 'success' ? 'var(--success)' : 'var(--danger)', padding: '12px 16px', borderRadius: 8, marginBottom: 20, fontSize: 14, fontWeight: 600 }}>{msg.text}</div>
          )}
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ color: 'var(--text-main)' }}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}/>
                  <input className="form-input" style={{ paddingLeft: 36 }} value={form.name} onChange={e => setForm({...form, name: e.target.value})}/>
                </div>
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ color: 'var(--text-main)' }}>Phone Number</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}/>
                  <input className="form-input" style={{ paddingLeft: 36 }} value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}/>
                </div>
              </div>
              <div className="form-group" style={{ gridColumn: '1/-1', margin: 0 }}>
                <label className="form-label" style={{ color: 'var(--text-main)' }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}/>
                  <input className="form-input" style={{ paddingLeft: 36, background: 'var(--gray-50)', color: 'var(--text-muted)' }} value={admin?.email} readOnly/>
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', margin: '24px 0', padding: '24px 0 0' }}>
              <h3 style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontFamily: 'Cormorant Garamond' }}><Lock size={14}/> Change Password</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ color: 'var(--text-main)' }}>Current Password</label>
                  <input className="form-input" type="password" value={form.currentPassword} onChange={e => setForm({...form, currentPassword: e.target.value})} placeholder="Current password" style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}/>
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ color: 'var(--text-main)' }}>New Password</label>
                  <input className="form-input" type="password" value={form.newPassword} onChange={e => setForm({...form, newPassword: e.target.value})} placeholder="Min. 6 characters" style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}/>
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {loading ? <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }}/> : <><Save size={16}/> Save Changes</>}
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
