import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

export default function ContactPage() {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState({ sending: false, sent: false, error: '' });

  useEffect(() => {
    if (user) {
      setForm(prev => ({ ...prev, name: user.name || '', email: user.email || '' }));
    }
  }, [user]);

  const submit = async e => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) return;
    setStatus({ sending: true, sent: false, error: '' });
    try {
      await api.post('/queries', form);
      setStatus({ sending: false, sent: true, error: '' });
      setForm({ name: user?.name || '', email: user?.email || '', subject: '', message: '' });
      setTimeout(() => setStatus(s => ({ ...s, sent: false })), 5000);
    } catch (err) {
      setStatus({ sending: false, sent: false, error: err.response?.data?.message || 'Failed to send message.' });
    }
  };

  return (
    <div style={{ paddingTop: 72, minHeight: '100vh', background: 'var(--bg-page)', transition: 'all 0.3s ease' }}>
      <div style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #0a2540 100%)', padding: '64px 0', textAlign: 'center' }}>
        <div className="container" style={{ padding: '0 24px' }}>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2.4rem, 6vw, 3.2rem)', color: 'white', fontWeight: 700 }}>Get In Touch</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16, marginTop: 10, maxWidth: 460, margin: '10px auto 0', lineHeight: 1.6 }}>We'd love to hear from you. Reach out anytime!</p>
        </div>
      </div>

      <div className="container contact-grid" style={{ padding: '60px 16px', display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 40 }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)', marginBottom: 28, fontFamily: 'Cormorant Garamond, serif', fontWeight: 700 }}>Contact Information</h2>
          {[
            [MapPin, 'Address', 'VIT-AP university\nAmaravati - 522237, Andhra Pradesh'],
            [Phone,  'Phone',   '+91 7448432423\nMon - Sat, 9am - 7pm'],
            [Mail,   'Email',   'hello@vistavoyage.in\nsupport@vistavoyage.in'],
          ].map(([Icon, label, val]) => (
            <div key={label} style={{ display: 'flex', gap: 16, marginBottom: 28 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={20} color="var(--accent)"/>
              </div>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: 4, fontSize: 14 }}>{label}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-line' }}>{val}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: 'var(--bg-card)', borderRadius: 24, padding: 36, boxShadow: 'var(--shadow)', border: '1px solid var(--border-color)' }}>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--text-main)', marginBottom: 24, fontFamily: 'Cormorant Garamond, serif', fontWeight: 700 }}>Send Us a Message</h2>
          {status.sent && <div style={{ background: '#d1fae5', color: '#065f46', padding: '14px 18px', borderRadius: 12, marginBottom: 20, fontSize: 14, fontWeight: 600 }}>✓ Message sent! We'll get back to you soon.</div>}
          {status.error && <div style={{ background: 'rgba(239,68,68,0.12)', color: 'var(--danger)', padding: '14px 18px', borderRadius: 12, marginBottom: 20, fontSize: 14 }}>{status.error}</div>}
          
          <form onSubmit={submit}>
            <div className="contact-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[['name','Your Name','text'],['email','Email','email']].map(([k,p,t]) => (
                <div className="form-group" key={k} style={{ margin: 0 }}>
                  <label className="form-label">{p}</label>
                  <input className="form-input" type={t} placeholder={p} value={form[k]} onChange={e => setForm({...form, [k]: e.target.value})} required/>
                </div>
              ))}
            </div>
            <div className="form-group" style={{ marginTop: 16 }}>
              <label className="form-label">Subject</label>
              <input className="form-input" placeholder="How can we help?" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} required/>
            </div>
            <div className="form-group">
              <label className="form-label">Message</label>
              <textarea className="form-input form-textarea" placeholder="Your message here..." value={form.message} onChange={e => setForm({...form, message: e.target.value})} required style={{ minHeight: 130 }}/>
            </div>
            <button type="submit" className="btn btn-primary" disabled={status.sending} style={{ width: '100%', padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 8 }}>
              {status.sending ? <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> : <Send size={15}/>} 
              {status.sending ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) { 
          .contact-grid { grid-template-columns: 1fr !important; }
          .contact-form-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
