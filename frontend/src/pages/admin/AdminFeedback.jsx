import React, { useEffect, useState } from 'react';
import { MessageSquare, Send, CheckCircle, Clock } from 'lucide-react';
import AdminLayout from '../../components/shared/AdminLayout';
import api from '../../utils/api';

export default function AdminFeedback() {
  const [feedbacks, setFeedbacks]   = useState([]);
  const [loading,   setLoading]     = useState(true);
  const [selected,  setSelected]    = useState(null);
  const [reply,     setReply]       = useState('');
  const [sending,   setSending]     = useState(false);
  const [filter,    setFilter]      = useState('All');

  const fetchFeedback = () => {
    setLoading(true);
    api.get('/feedback')
      .then(r => setFeedbacks(r.data.feedbacks || []))
      .catch(e => { console.error('Feedback error:', e); alert(e.response?.data?.message || 'Failed to load feedback'); })
      .finally(() => setLoading(false));
  };
  useEffect(() => { fetchFeedback(); }, []);

  const sendReply = async () => {
    if (!reply.trim()) return;
    setSending(true);
    try {
      await api.put(`/feedback/${selected._id}/reply`, { reply });
      setReply('');
      setSelected(null);
      fetchFeedback();
    } finally { setSending(false); }
  };

  const filtered = feedbacks.filter(f => filter === 'All' || f.status === filter);

  return (
    <AdminLayout>
      <div style={{ padding: 32 }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: '2rem', color: 'var(--text-main)', fontFamily: 'Cormorant Garamond' }}>Feedback Reports</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>Manage user complaints and messages</p>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {['All','Open','Replied'].map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{ padding: '8px 18px', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'DM Sans', fontSize: 13, background: filter === s ? 'var(--accent)' : 'var(--gray-100)', color: filter === s ? 'var(--primary)' : 'var(--text-main)', boxShadow: 'var(--shadow)', fontWeight: filter === s ? 700 : 500 }}>{s}</button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: 24 }}>
          {/* List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {loading ? <div style={{ textAlign: 'center', padding: 60 }}><div className="spinner"/></div> :
            filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 60, background: 'var(--bg-card)', borderRadius: 16, boxShadow: 'var(--shadow)', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
                <MessageSquare size={40} style={{ marginBottom: 12 }}/><br/>No feedback found
              </div>
            ) : filtered.map(f => (
              <div key={f._id} onClick={() => { setSelected(f); setReply(''); }}
                style={{ background: 'var(--bg-card)', borderRadius: 14, padding: '18px 20px', boxShadow: 'var(--shadow)', cursor: 'pointer', border: selected?._id === f._id ? '2px solid var(--accent)' : '2px solid var(--border-color)', transition: 'border 0.2s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: 13 }}>{f.user?.name?.charAt(0)}</span>
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)' }}>{f.user?.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{f.user?.email}</div>
                    </div>
                  </div>
                  <span className={`badge ${f.status === 'Replied' ? 'badge-confirmed' : 'badge-pending'}`}>
                    {f.status === 'Replied' ? <CheckCircle size={11} style={{ marginRight: 4 }}/> : <Clock size={11} style={{ marginRight: 4 }}/>} {f.status}
                  </span>
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-main)', marginBottom: 4 }}>{f.subject}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.6 }}>{f.message}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>{new Date(f.createdAt).toLocaleDateString('en-IN')}</div>
              </div>
            ))}
          </div>

          {/* Reply Panel */}
          {selected && (
            <div style={{ background: 'var(--bg-card)', borderRadius: 16, padding: 24, boxShadow: 'var(--shadow-lg)', height: 'fit-content', position: 'sticky', top: 20, border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', fontFamily: 'Cormorant Garamond', fontWeight: 700 }}>Reply to Message</h3>
                <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>✕</button>
              </div>

              <div style={{ background: 'var(--gray-50)', borderRadius: 12, padding: 16, marginBottom: 16, border: '1px solid var(--border-color)' }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-main)', marginBottom: 6 }}>{selected.subject}</div>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>{selected.message}</p>
              </div>

              {selected.adminReply && (
                <div style={{ background: 'rgba(16,185,129,0.1)', borderRadius: 12, padding: 16, marginBottom: 16, borderLeft: '3px solid var(--success)' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--success)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Previous Reply</div>
                  <p style={{ fontSize: 14, color: 'var(--text-main)', lineHeight: 1.6 }}>{selected.adminReply}</p>
                </div>
              )}

              <textarea value={reply} onChange={e => setReply(e.target.value)} placeholder="Type your reply..." style={{ width: '100%', minHeight: 100, padding: '12px 14px', border: '2px solid var(--border-color)', borderRadius: 12, fontFamily: 'DM Sans', fontSize: 14, resize: 'vertical', outline: 'none', boxSizing: 'border-box', background: 'var(--bg-card)', color: 'var(--text-main)' }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border-color)'}/>

              <button onClick={sendReply} disabled={!reply.trim() || sending} className="btn btn-primary" style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                {sending ? <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }}/> : <><Send size={15}/> Send Reply</>}
              </button>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
