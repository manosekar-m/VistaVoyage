import React, { useEffect, useState } from 'react';
import { Search, ChevronDown, Star } from 'lucide-react';
import AdminLayout from '../../components/shared/AdminLayout';
import api from '../../utils/api';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [filter,   setFilter]   = useState('All');

  const fetchBookings = () => {
    setLoading(true);
    api.get('/bookings')
      .then(r => setBookings(r.data.bookings || []))
      .catch(e => { console.error('Bookings error:', e); alert(e.response?.data?.message || 'Failed to load bookings'); })
      .finally(() => setLoading(false));
  };
  useEffect(() => { fetchBookings(); }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/bookings/${id}/status`, { status });
    fetchBookings();
  };

  const filtered = bookings.filter(b => {
    const matchSearch = !search || [b.name, b.email, b.package?.title, b.bookingId].some(v => v?.toLowerCase().includes(search.toLowerCase()));
    const matchFilter = filter === 'All' || b.status === filter;
    return matchSearch && matchFilter;
  });

  const statusColors = { 
    Pending: ['rgba(245,158,11,0.1)','var(--accent)'], 
    Confirmed: ['rgba(16,185,129,0.1)','var(--success)'], 
    Cancelled: ['rgba(239,68,68,0.1)','var(--danger)'] 
  };

  return (
    <AdminLayout>
      <div style={{ padding: 32 }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: '2rem', color: 'var(--text-main)', fontFamily: 'Cormorant Garamond' }}>Bookings</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>Manage all travel bookings ({bookings.length} total)</p>
        </div>

        {/* Filters */}
        <div style={{ background: 'var(--bg-card)', borderRadius: 16, padding: '16px 20px', boxShadow: 'var(--shadow)', marginBottom: 24, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', border: '1px solid var(--border-color)' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}/>
            <input style={{ width: '100%', padding: '9px 12px 9px 36px', border: '2px solid var(--border-color)', borderRadius: 10, fontFamily: 'DM Sans', fontSize: 14, outline: 'none', boxSizing: 'border-box', background: 'transparent', color: 'var(--text-main)' }}
              placeholder="Search by name, email, package..." value={search} onChange={e => setSearch(e.target.value)}/>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['All', 'Pending', 'Confirmed', 'Cancelled'].map(s => (
              <button key={s} onClick={() => setFilter(s)} style={{
                padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontFamily: 'DM Sans',
                background: filter === s ? 'var(--accent)' : 'var(--gray-100)',
                color: filter === s ? 'var(--primary)' : 'var(--text-main)',
                fontWeight: filter === s ? 700 : 500
              }}>{s}</button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div style={{ background: 'var(--bg-card)', borderRadius: 16, boxShadow: 'var(--shadow)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 80 }}><div className="spinner"/></div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>No bookings found</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 800 }}>
                <thead>
                  <tr style={{ background: 'var(--gray-50)', borderBottom: '1px solid var(--border-color)' }}>
                    {['Booking ID','User','Package','Travel Date','Guests','Preferences','Amount','Rating','Status','Action'].map(h => (
                      <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: 0.5, whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((b, i) => {
                    const [bg, fg] = statusColors[b.status] || [];
                    return (
                      <tr key={b._id} style={{ borderBottom: '1px solid var(--border-color)', background: i % 2 === 0 ? 'var(--bg-card)' : 'var(--gray-50)' }}>
                        <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontSize: 13, fontWeight: 700, color: 'var(--accent)' }}>{b.bookingId}</td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-main)' }}>{b.user?.name || b.name}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{b.user?.email || b.email}</div>
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: 14, color: 'var(--text-main)', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.package?.title}</td>
                        <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--text-main)' }}>{new Date(b.travelDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                        <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--text-main)' }}>
                          <div><span style={{ fontWeight: 600 }}>{b.adults || (b.persons || 1)}</span> Adults</div>
                          {b.children > 0 && <div style={{ color: 'var(--text-muted)' }}>{b.children} Children</div>}
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: 13 }}>
                          <div style={{ color: 'var(--text-muted)' }}>🍽️ {b.foodPreference || 'Not Specified'}</div>
                          <div style={{ color: 'var(--text-muted)' }}>🏨 {b.stayPreference || 'Not Specified'}</div>
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: 14 }}>
                          <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>₹{b.totalAmount?.toLocaleString()}</span>
                          {b.discountApplied > 0 && <div style={{ fontSize: 11, color: 'var(--success)' }}>(-₹{b.discountApplied}) {b.couponCode}</div>}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          {b.rating ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-main)' }}>
                              <Star size={14} fill="var(--accent)" color="var(--accent)" />
                              <span style={{ fontSize: 13, fontWeight: 600 }}>{b.rating}/5</span>
                            </div>
                          ) : (
                            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>-</span>
                          )}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ background: bg, color: fg, padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 800 }}>{b.status}</span>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ position: 'relative', display: 'inline-block' }}>
                            <select value={b.status} onChange={e => updateStatus(b._id, e.target.value)}
                              style={{ padding: '6px 10px', border: '1px solid var(--border-color)', borderRadius: 8, fontSize: 13, fontFamily: 'DM Sans', cursor: 'pointer', outline: 'none', background: 'var(--bg-card)', color: 'var(--text-main)' }}>
                              <option>Pending</option>
                              <option>Confirmed</option>
                              <option>Cancelled</option>
                            </select>
                          </div>
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
    </AdminLayout>
  );
}
