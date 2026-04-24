import React, { useEffect, useState } from 'react';
import { MapPin, Clock, Calendar, Users, Trash2, XCircle, Star } from 'lucide-react';
import api from '../../utils/api';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);

  const fetchBookings = () => {
    setLoading(true);
    api.get('/bookings/my').then(r => setBookings(r.data.bookings)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchBookings(); }, []);

  const cancelBooking = async id => {
    if (!window.confirm('Cancel this booking?')) return;
    await api.put(`/bookings/${id}/cancel`);
    fetchBookings();
  };

  const deleteBooking = async id => {
    if (!window.confirm('Remove this booking from history?')) return;
    await api.delete(`/bookings/${id}`);
    fetchBookings();
  };

  const rateBooking = async (id, rating) => {
    await api.put(`/bookings/${id}/rate`, { rating });
    fetchBookings();
  };

  const statusColor = s => ({ Pending: '#fef3c7|#92400e', Confirmed: '#d1fae5|#065f46', Cancelled: '#fee2e2|#991b1b' }[s] || 'transparent|var(--text-muted)').split('|');

  return (
    <div style={{ paddingTop: 80, minHeight: '100vh', background: 'var(--bg-page)', paddingBottom: 60, transition: 'all 0.3s' }}>
      <div style={{ background: 'var(--primary)', padding: '40px 0 48px' }}>
        <div className="container">
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.6rem', color: 'white' }}>My Bookings</h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', marginTop: 6 }}>Track and manage all your travel bookings</p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 36 }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 80 }}><div className="spinner"/></div>
        ) : bookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 80, background: 'var(--bg-card)', borderRadius: 20, boxShadow: 'var(--shadow)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🧳</div>
            <h3 style={{ color: 'var(--text-main)', fontSize: '1.4rem' }}>No bookings yet</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>Start your journey by exploring our packages</p>
            <Link to="/packages" className="btn btn-primary" style={{ marginTop: 20, display: 'inline-flex' }}>Explore Packages</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {bookings.map(b => {
              const [bg, fg] = statusColor(b.status);
              return (
                <div key={b._id} style={{ background: 'var(--bg-card)', borderRadius: 16, boxShadow: 'var(--shadow)', overflow: 'hidden', display: 'flex', flexDirection: 'column', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', minHeight: 160 }} className="booking-grid">
                    <img src={b.package?.images?.[0] || 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=400'} alt={b.package?.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                    <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                          <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)' }}>{b.package?.title}</h3>
                          <span className="badge" style={{ background: bg, color: fg }}>{b.status}</span>
                        </div>
                        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                          {[
                            [MapPin, b.package?.location],
                            [Clock, `${b.package?.duration} Days`],
                            [Calendar, new Date(b.travelDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })],
                            [Users, `${b.persons} Person${b.persons > 1 ? 's' : ''}`],
                          ].map(([Icon, val], i) => (
                            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--text-muted)' }}><Icon size={13}/>{val}</span>
                          ))}
                        </div>
                        <div style={{ marginTop: 10 }}>
                          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Booking ID: </span>
                          <span style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 600, color: 'var(--text-main)' }}>{b.bookingId}</span>
                          <span style={{ margin: '0 12px', color: 'var(--border-color)' }}>|</span>
                          <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent)' }}>₹{b.totalAmount?.toLocaleString()}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 8, marginTop: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                        {b.status !== 'Cancelled' && (
                          <button onClick={() => cancelBooking(b._id)} className="btn btn-sm" style={{ background: '#fee2e2', color: '#991b1b', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <XCircle size={13}/> Cancel
                          </button>
                        )}
                        <button onClick={() => deleteBooking(b._id)} className="btn btn-sm" style={{ background: 'var(--gray-100)', color: 'var(--gray-600)', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Trash2 size={13}/> Remove
                        </button>
                        {b.status === 'Confirmed' && (
                          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <span style={{ fontSize: 13, color: 'var(--text-muted)', marginRight: 4 }}>{b.rating ? 'Your Rating:' : 'Rate Trip:'}</span>
                            {[1, 2, 3, 4, 5].map(star => (
                              <Star
                                key={star}
                                size={16}
                                onClick={() => !b.rating && rateBooking(b._id, star)}
                                fill={star <= (b.rating || 0) ? '#eab308' : 'none'}
                                color={star <= (b.rating || 0) ? '#eab308' : 'var(--text-muted)'}
                                style={{ cursor: b.rating ? 'default' : 'pointer', transition: 'transform 0.1s' }}
                                onMouseEnter={e => { if (!b.rating) e.currentTarget.style.transform = 'scale(1.2)' }}
                                onMouseLeave={e => { if (!b.rating) e.currentTarget.style.transform = 'scale(1)' }}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <style>{`
        @media (max-width: 600px) { .booking-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
