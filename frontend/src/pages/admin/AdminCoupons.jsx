import React, { useEffect, useState } from 'react';
import { Plus, Trash2, X, Tag, Calendar } from 'lucide-react';
import AdminLayout from '../../components/shared/AdminLayout';
import api from '../../utils/api';

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  
  const [form, setForm] = useState({ code: '', discountAmount: '', validUntil: '', isActive: true });

  const fetchCoupons = () => {
    setLoading(true);
    api.get('/coupons')
      .then(r => setCoupons(r.data.coupons || []))
      .catch(e => { console.error('Coupons error:', e); alert(e.response?.data?.message || 'Failed to load coupons'); })
      .finally(() => setLoading(false));
  };
  
  useEffect(() => { fetchCoupons(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.validUntil) return setMsg('Please select an expiry date');
    setSaving(true); setMsg('');
    try {
      await api.post('/coupons', {
        code: form.code.trim().toUpperCase(),
        discountAmount: Number(form.discountAmount),
        validUntil: form.validUntil,
        isActive: form.isActive
      });
      setModal(false);
      fetchCoupons();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const deleteCoupon = async (id) => {
    if (!window.confirm('Delete this coupon?')) return;
    try {
      await api.delete(`/coupons/${id}`);
      fetchCoupons();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };
  
  const toggleStatus = async (id, currentStatus) => {
    try {
      await api.put(`/coupons/${id}`, { isActive: !currentStatus });
      fetchCoupons();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const openModal = () => {
    setForm({ code: '', discountAmount: '', validUntil: '', isActive: true });
    setMsg('');
    setModal(true);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'No Date';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'Invalid Date';
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const isExpired = (dateStr) => {
    if (!dateStr) return false;
    return new Date(dateStr) < new Date();
  };

  return (
    <AdminLayout>
      <div style={{ padding: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: '2rem', color: 'var(--text-main)', fontFamily: 'Cormorant Garamond' }}>Coupons</h1>
            <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>Manage discount codes ({coupons.length} total)</p>
          </div>
          <button onClick={openModal} className="btn btn-primary"><Plus size={16}/> Create Coupon</button>
        </div>

        <div style={{ background: 'var(--bg-card)', borderRadius: 16, boxShadow: 'var(--shadow)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 80 }}><div className="spinner"/></div>
          ) : coupons.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>No coupons found</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
                <thead>
                  <tr style={{ background: 'var(--gray-50)', borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Coupon Code</th>
                    <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Discount (₹)</th>
                    <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Expiry Date</th>
                    <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Status</th>
                    <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((c, i) => {
                    const expired = isExpired(c.validUntil);
                    return (
                      <tr key={c._id} style={{ borderBottom: '1px solid var(--border-color)', background: i % 2 === 0 ? 'var(--bg-card)' : 'var(--gray-50)' }}>
                        <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontSize: 14, fontWeight: 800, color: 'var(--accent)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Tag size={14}/> {c.code}
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 700, color: 'var(--success)' }}>
                          ₹{c.discountAmount}
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: 13 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: expired ? 'var(--danger)' : 'var(--text-main)' }}>
                            <Calendar size={13} />
                            {formatDate(c.validUntil)}
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <button onClick={() => toggleStatus(c._id, c.isActive)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                            <span style={{ 
                              background: c.isActive && !expired ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', 
                              color: c.isActive && !expired ? 'var(--success)' : 'var(--danger)', 
                              padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, textTransform: 'uppercase' 
                            }}>
                              {c.isActive ? (expired ? 'Expired' : 'Active') : 'Inactive'}
                            </span>
                          </button>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <button onClick={() => deleteCoupon(c._id)} style={{ width: 32, height: 32, background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)', transition: 'all 0.2s' }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'var(--danger)'; e.currentTarget.style.color = 'white'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.color = 'var(--danger)'; }}>
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, backdropFilter: 'blur(4px)' }} onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div style={{ background: 'var(--bg-card)', borderRadius: 24, padding: '32px 40px', width: '100%', maxWidth: 480, animation: 'fadeIn 0.3s ease', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: '1.8rem', color: 'var(--text-main)', fontFamily: 'Cormorant Garamond', fontWeight: 700 }}>Create Coupon</h2>
              <button onClick={() => setModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={22}/></button>
            </div>
            {msg && <div style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 13, fontWeight: 600 }}>{msg}</div>}
            
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Coupon Code *</label>
                <input className="form-input" style={{ textTransform: 'uppercase' }} value={form.code} onChange={e => setForm({...form, code: e.target.value.toUpperCase().replace(/\s/g, '')})} required placeholder="e.g. TRAVEL50"/>
              </div>
              <div className="form-group">
                <label className="form-label">Discount Amount (₹) *</label>
                <input className="form-input" type="number" min="1" value={form.discountAmount} onChange={e => setForm({...form, discountAmount: e.target.value})} required placeholder="e.g. 500"/>
              </div>
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Calendar size={13} color="var(--accent)"/> Expiry Date *</label>
                <input className="form-input" type="date" min={new Date().toISOString().split('T')[0]} value={form.validUntil} onChange={e => setForm({...form, validUntil: e.target.value})} required/>
              </div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12 }}>
                <input type="checkbox" id="isActive" checked={form.isActive} onChange={e => setForm({...form, isActive: e.target.checked})} style={{ width: 18, height: 18, cursor: 'pointer', accentColor: 'var(--accent)' }}/>
                <label htmlFor="isActive" style={{ fontSize: 14, color: 'var(--text-main)', cursor: 'pointer', fontWeight: 500 }}>Is Active</label>
              </div>
              
              <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
                <button type="submit" disabled={saving} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  {saving ? <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }}/> : 'Create'}
                </button>
                <button type="button" onClick={() => setModal(false)} className="btn" style={{ background: 'var(--gray-100)', color: 'var(--gray-600)' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
