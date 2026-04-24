import React, { useEffect, useState } from 'react';
import { MessageSquare, Send, CheckCircle } from 'lucide-react';
import api from '../../utils/api';

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [form, setForm] = useState({ subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [msg, setMsg] = useState('');

  const fetchFeedback = () => {
    api.get('/feedback/my').then(r => setFeedbacks(r.data.feedbacks)).finally(() => setFetching(false));
  };
  useEffect(() => { fetchFeedback(); }, []);

  const submit = async e => {
    e.preventDefault();
    setLoading(true); setMsg('');
    try {
      await api.post('/feedback', form);
      setForm({ subject: '', message: '' });
      setMsg('Feedback submitted successfully!');
      fetchFeedback();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to submit');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ paddingTop: 80, minHeight: '100vh', background: 'var(--bg-page)', paddingBottom: 60, transition: 'all 0.3s' }}>
      <div style={{ background: 'var(--primary)', padding: '40px 0 48px' }}>
        <div className="container">
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.6rem', color: 'white' }}>Feedback & Support</h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', marginTop: 6 }}>Submit queries or complaints. Our team will reply shortly.</p>
        </div>
      </div>

      <div className="container feedback-grid" style={{ paddingTop: 36, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
        {/* Submit Form */}
        <div style={{ background: 'var(--bg-card)', borderRadius: 20, padding: 32, boxShadow: 'var(--shadow)', border: '1px solid var(--border-color)', height: 'fit-content' }}>
          <h2 style={{ fontSize: '1.3rem', color: 'var(--text-main)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <MessageSquare size={18} color="var(--accent)"/> Send Message
          </h2>
          {msg && <div style={{ background: '#d1fae5', color: '#065f46', padding: '12px 16px', borderRadius: 8, marginBottom: 16, fontSize: 14 }}>{msg}</div>}
          <form onSubmit={submit}>
            <div className="form-group">
              <label className="form-label">Subject</label>
              <input className="form-input" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} placeholder="Brief subject..." required/>
            </div>
            <div className="form-group">
              <label className="form-label">Message</label>
              <textarea className="form-input form-textarea" value={form.message} onChange={e => setForm({...form, message: e.target.value})} placeholder="Describe your issue or query..." required style={{ minHeight: 120 }}/>
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {loading ? <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }}/> : <><Send size={15}/> Submit Feedback</>}
            </button>
          </form>
        </div>

        {/* Feedback History */}
        <div>
          <h2 style={{ fontSize: '1.3rem', color: 'var(--text-main)', marginBottom: 20 }}>Your Submissions</h2>
          {fetching ? <div className="spinner"/> :
          feedbacks.length === 0 ? (
            <div style={{ background: 'var(--bg-card)', borderRadius: 16, padding: 32, textAlign: 'center', boxShadow: 'var(--shadow)', border: '1px solid var(--border-color)' }}>
              <MessageSquare size={40} color="var(--text-muted)" style={{ opacity: 0.5, marginBottom: 12 }}/>
              <p style={{ color: 'var(--text-muted)' }}>No feedback submitted yet</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {feedbacks.map(f => (
                <div key={f._id} style={{ background: 'var(--bg-card)', borderRadius: 16, padding: 20, boxShadow: 'var(--shadow)', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <h4 style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>{f.subject}</h4>
                    <span className={`badge badge-${f.status === 'Replied' ? 'confirmed' : 'pending'}`}>{f.status}</span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 12 }}>{f.message}</p>
                  {f.adminReply && (
                    <div style={{ background: '#d1fae5', borderRadius: 10, padding: '12px 16px', borderLeft: '3px solid var(--success)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <CheckCircle size={13} color="var(--success)"/>
                        <span style={{ fontSize: 12, fontWeight: 600, color: '#065f46' }}>Admin Reply</span>
                      </div>
                      <p style={{ fontSize: 14, color: '#064e3b' }}>{f.adminReply}</p>
                    </div>
                  )}
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 10 }}>
                    {new Date(f.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) { .feedback-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
