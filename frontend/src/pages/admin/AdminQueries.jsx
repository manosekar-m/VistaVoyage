import React, { useEffect, useState } from 'react';
import { HelpCircle, CheckCircle, XCircle, Clock } from 'lucide-react';
import AdminLayout from '../../components/shared/AdminLayout';
import api from '../../utils/api';

export default function AdminQueries() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const fetchQueries = () => {
    setLoading(true);
    api.get('/queries')
      .then(r => setQueries(r.data.queries || []))
      .catch(e => { console.error('Queries error:', e); alert(e.response?.data?.message || 'Failed to load queries'); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchQueries(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/queries/${id}/status`, { status });
      fetchQueries();
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to update status');
    }
  };

  const filtered = queries.filter(q => filter === 'All' || q.status === filter);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Accepted': return <span className="badge badge-confirmed"><CheckCircle size={11} style={{ marginRight: 4 }}/> Accepted</span>;
      case 'Rejected': return <span className="badge badge-cancelled"><XCircle size={11} style={{ marginRight: 4 }}/> Rejected</span>;
      default: return <span className="badge badge-pending"><Clock size={11} style={{ marginRight: 4 }}/> Pending</span>;
    }
  };

  return (
    <AdminLayout>
      <div style={{ padding: 32 }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: '2rem', color: 'var(--text-main)', fontFamily: 'Cormorant Garamond' }}>User Queries</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>Manage contact queries and update accepted/rejected statuses</p>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {['All', 'Pending', 'Accepted', 'Rejected'].map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{ padding: '8px 18px', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'DM Sans', fontSize: 13, background: filter === s ? 'var(--accent)' : 'var(--gray-100)', color: filter === s ? 'var(--primary)' : 'var(--text-main)', boxShadow: 'var(--shadow)', fontWeight: filter === s ? 700 : 500 }}>{s}</button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {loading ? <div style={{ textAlign: 'center', padding: 60 }}><div className="spinner"/></div> :
          filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 60, background: 'var(--bg-card)', borderRadius: 16, boxShadow: 'var(--shadow)', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
              <HelpCircle size={40} style={{ marginBottom: 12 }}/><br/>No queries found
            </div>
          ) : filtered.map(q => (
            <div key={q._id} style={{ background: 'var(--bg-card)', borderRadius: 14, padding: '18px 20px', boxShadow: 'var(--shadow)', border: '2px solid var(--border-color)', display: 'flex', gap: 20, alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: 13 }}>{q.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)' }}>{q.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{q.email}</div>
                    </div>
                  </div>
                  {getStatusBadge(q.status)}
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-main)', marginBottom: 4 }}>{q.subject}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{q.message}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 12 }}>{new Date(q.createdAt).toLocaleString('en-IN')}</div>
              </div>
              
              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 120 }}>
                {q.status !== 'Accepted' && (
                  <button onClick={() => updateStatus(q._id, 'Accepted')} className="btn btn-sm" style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--success)', border: '1px solid rgba(16,185,129,0.2)', width: '100%', justifyContent: 'center' }}>
                    Accept
                  </button>
                )}
                {q.status !== 'Rejected' && (
                  <button onClick={() => updateStatus(q._id, 'Rejected')} className="btn btn-sm" style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', border: '1px solid rgba(239,68,68,0.2)', width: '100%', justifyContent: 'center' }}>
                    Reject
                  </button>
                )}
                {q.status !== 'Pending' && (
                  <button onClick={() => updateStatus(q._id, 'Pending')} className="btn btn-sm" style={{ background: 'var(--gray-100)', color: 'var(--text-muted)', border: '1px solid var(--border-color)', width: '100%', justifyContent: 'center' }}>
                    Reset
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
