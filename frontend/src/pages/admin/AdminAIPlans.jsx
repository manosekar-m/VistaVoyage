import React, { useEffect, useState } from 'react';
import { Sparkles, Trash2, CheckCircle, XCircle, Mail, MapPin, Calendar, Users, Eye, X, Send } from 'lucide-react';
import AdminLayout from '../../components/shared/AdminLayout';
import api from '../../utils/api';

export default function AdminAIPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [emailModal, setEmailModal] = useState(false);
  const [emailMsg, setEmailMsg] = useState('');
  const [sending, setSending] = useState(false);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/ai-planner/all');
      setPlans(data.plans || []);
    } catch (err) {
      console.error('Fetch Plans Error:', err);
      const msg = err.response?.data?.message || err.message || 'Failed to fetch plans';
      alert(`Error: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPlans(); }, []);

  const handleStatus = async (id, status) => {
    try {
      await api.put(`/ai-planner/${id}/status`, { status });
      fetchPlans();
      if (selectedPlan?._id === id) setSelectedPlan({ ...selectedPlan, status });
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this plan?')) return;
    try {
      await api.delete(`/ai-planner/${id}`);
      fetchPlans();
      if (selectedPlan?._id === id) setSelectedPlan(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (!emailMsg.trim()) return;
    setSending(true);
    try {
      await api.post(`/ai-planner/${selectedPlan._id}/email`, { message: emailMsg });
      alert('Email sent successfully!');
      setEmailModal(false);
      setEmailMsg('');
      fetchPlans(); // Refresh to see emailsSent count
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send email');
    } finally {
      setSending(false);
    }
  };

  return (
    <AdminLayout>
      <div style={{ padding: 32 }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: '2.5rem', color: 'var(--text-main)', fontFamily: 'Cormorant Garamond, serif', fontWeight: 700 }}>AI Travel Planner</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>Review and manage AI-generated itineraries for users.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: selectedPlan ? '1fr 400px' : '1fr', gap: 24, transition: 'all 0.3s ease' }}>
          
          {/* Plans Table */}
          <div style={{ background: 'var(--bg-card)', borderRadius: 20, border: '1px solid var(--border-color)', boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
            {loading ? (
              <div style={{ padding: 100, textAlign: 'center' }}><div className="spinner" /></div>
            ) : plans.length === 0 ? (
              <div style={{ padding: 100, textAlign: 'center', color: 'var(--text-muted)' }}>No AI plans found.</div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'var(--gray-50)', borderBottom: '1px solid var(--border-color)' }}>
                      <th style={{ padding: 16, textAlign: 'left', fontSize: 12, color: 'var(--accent)', textTransform: 'uppercase' }}>User</th>
                      <th style={{ padding: 16, textAlign: 'left', fontSize: 12, color: 'var(--accent)', textTransform: 'uppercase' }}>Destination</th>
                      <th style={{ padding: 16, textAlign: 'left', fontSize: 12, color: 'var(--accent)', textTransform: 'uppercase' }}>Details</th>
                      <th style={{ padding: 16, textAlign: 'left', fontSize: 12, color: 'var(--accent)', textTransform: 'uppercase' }}>Status</th>
                      <th style={{ padding: 16, textAlign: 'left', fontSize: 12, color: 'var(--accent)', textTransform: 'uppercase' }}>Emails</th>
                      <th style={{ padding: 16, textAlign: 'right', fontSize: 12, color: 'var(--accent)', textTransform: 'uppercase' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plans.map(plan => (
                      <tr key={plan._id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }}>
                        <td style={{ padding: 16 }}>
                          <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{plan.user?.name}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{plan.user?.email}</div>
                        </td>
                        <td style={{ padding: 16 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
                            <MapPin size={14} color="var(--accent)" /> {plan.destination}
                          </div>
                        </td>
                        <td style={{ padding: 16 }}>
                          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                            {plan.days} Days • {plan.travelers}
                          </div>
                        </td>
                        <td style={{ padding: 16 }}>
                          <span style={{ 
                            padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 800, textTransform: 'uppercase',
                            background: plan.status === 'Accepted' ? 'rgba(16,185,129,0.1)' : plan.status === 'Rejected' ? 'rgba(239,68,68,0.1)' : 'rgba(201,168,76,0.1)',
                            color: plan.status === 'Accepted' ? '#10b981' : plan.status === 'Rejected' ? '#ef4444' : 'var(--accent)'
                          }}>
                            {plan.status}
                          </span>
                        </td>
                        <td style={{ padding: 16, textAlign: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', color: 'var(--text-muted)', fontSize: 13, fontWeight: 600 }}>
                            <Mail size={14} /> {plan.emailsSent}
                          </div>
                        </td>
                        <td style={{ padding: 16, textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                            <button onClick={() => setSelectedPlan(plan)} style={{ padding: 8, background: 'var(--gray-100)', border: 'none', borderRadius: 8, cursor: 'pointer', color: 'var(--text-main)' }} title="View Plan">
                              <Eye size={16} />
                            </button>
                            <button onClick={() => handleDelete(plan._id)} style={{ padding: 8, background: 'rgba(239,68,68,0.1)', border: 'none', borderRadius: 8, cursor: 'pointer', color: '#ef4444' }} title="Delete">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Detailed View Sidebar */}
          {selectedPlan && (
            <div style={{ background: 'var(--bg-card)', borderRadius: 20, border: '1px solid var(--border-color)', boxShadow: 'var(--shadow)', padding: 24, position: 'sticky', top: 32, height: 'fit-content', maxHeight: 'calc(100vh - 64px)', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)' }}>Plan Details</h3>
                <button onClick={() => setSelectedPlan(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
              </div>

              <div style={{ marginBottom: 24 }}>
                <div style={{ color: 'var(--accent)', fontWeight: 800, fontSize: 11, textTransform: 'uppercase', marginBottom: 8 }}>{selectedPlan.result.title}</div>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>{selectedPlan.result.summary}</p>
              </div>

              <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
                <button 
                  onClick={() => handleStatus(selectedPlan._id, 'Accepted')}
                  disabled={selectedPlan.status === 'Accepted'}
                  style={{ flex: 1, padding: '10px', background: '#10b981', color: 'white', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, opacity: selectedPlan.status === 'Accepted' ? 0.5 : 1 }}
                >
                  <CheckCircle size={16} /> Accept
                </button>
                <button 
                  onClick={() => handleStatus(selectedPlan._id, 'Rejected')}
                  disabled={selectedPlan.status === 'Rejected'}
                  style={{ flex: 1, padding: '10px', background: '#ef4444', color: 'white', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, opacity: selectedPlan.status === 'Rejected' ? 0.5 : 1 }}
                >
                  <XCircle size={16} /> Reject
                </button>
              </div>

              <button 
                onClick={() => setEmailModal(true)}
                style={{ width: '100%', padding: '12px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 32 }}
              >
                <Mail size={18} /> Send Update Email
              </button>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 24 }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Itinerary Preview</h4>
                {selectedPlan.result.itinerary.map(day => (
                  <div key={day.day} style={{ marginBottom: 16, padding: 12, background: 'var(--gray-50)', borderRadius: 12 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 6 }}>Day {day.day}: {day.title}</div>
                    <ul style={{ paddingLeft: 16, margin: 0, fontSize: 12, color: 'var(--text-muted)' }}>
                      {day.activities.map((act, i) => <li key={i} style={{ marginBottom: 4 }}>{act}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Email Modal */}
      {emailModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'var(--bg-card)', borderRadius: 24, padding: 32, width: '100%', maxWidth: 500, boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'Cormorant Garamond, serif' }}>Send Update to {selectedPlan.user?.name}</h3>
              <button onClick={() => setEmailModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSendEmail}>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>Message Body</label>
                <textarea 
                  required
                  className="form-input" 
                  style={{ minHeight: 180, padding: 16, resize: 'none' }}
                  placeholder="Type your message to the user here..."
                  value={emailMsg}
                  onChange={e => setEmailMsg(e.target.value)}
                />
              </div>
              
              <div style={{ display: 'flex', gap: 12 }}>
                <button 
                  type="submit" 
                  disabled={sending}
                  style={{ flex: 1, padding: 14, background: 'var(--accent)', color: 'var(--primary-navy)', border: 'none', borderRadius: 12, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
                >
                  {sending ? <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : <><Send size={18} /> Send Email Now</>}
                </button>
                <button type="button" onClick={() => setEmailModal(false)} style={{ padding: 14, background: 'var(--gray-100)', color: 'var(--text-main)', border: 'none', borderRadius: 12, fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
