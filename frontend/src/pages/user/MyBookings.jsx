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
    <div style={{ paddingTop: 72, minHeight: '100vh', background: 'var(--bg-page)', paddingBottom: 80, transition: 'all 0.3s' }}>
      <div style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #0a2540 100%)', padding: '48px 0 64px' }}>
        <div className="container" style={{ padding: '0 24px' }}>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2.4rem, 5vw, 3.2rem)', color: 'white', fontWeight: 700 }}>My Bookings</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 8, fontSize: 16, maxWidth: 500 }}>Track your handcrafted journeys and upcoming adventures in one place.</p>
        </div>
      </div>

      <div className="container" style={{ marginTop: -32, padding: '0 16px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 80, background: 'var(--bg-card)', borderRadius: 24, boxShadow: 'var(--shadow)' }}>
            <div className="spinner" style={{ margin: '0 auto' }}/>
            <p style={{ marginTop: 16, color: 'var(--text-muted)', fontWeight: 500 }}>Fetching your travel history...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px', background: 'var(--bg-card)', borderRadius: 24, boxShadow: 'var(--shadow)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>🌍</div>
            <h3 style={{ color: 'var(--text-main)', fontSize: '1.6rem', fontFamily: 'Cormorant Garamond, serif', fontWeight: 700 }}>No Bookings Yet</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: 8, fontSize: 15 }}>Your next story is waiting to be written.</p>
            <Link to="/packages" className="btn btn-primary" style={{ marginTop: 28, display: 'inline-flex', padding: '14px 32px' }}>Explore Destinations</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {bookings.map(b => {
              const [bg, fg] = statusColor(b.status);
              return (
                <div key={b._id} style={{ background: 'var(--bg-card)', borderRadius: 24, boxShadow: 'var(--shadow)', overflow: 'hidden', border: '1px solid var(--border-color)', transition: 'transform 0.3s' }}>
                  <div className="booking-card-grid" style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: 180 }}>
                    <div style={{ position: 'relative', overflow: 'hidden' }}>
                      <img src={b.package?.images?.[0] || 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=600'} alt={b.package?.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                      <div style={{ position: 'absolute', top: 16, left: 16, background: bg, color: fg, padding: '6px 14px', borderRadius: 40, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>{b.status}</div>
                    </div>
                    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                          <h3 style={{ fontSize: '1.3rem', color: 'var(--text-main)', fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, margin: 0 }}>{b.package?.title}</h3>
                          <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-main)' }}>₹{b.totalAmount?.toLocaleString()}</div>
                        </div>
                        <div style={{ display: 'flex', gap: '16px 24px', flexWrap: 'wrap', marginBottom: 16 }}>
                          {[
                            [MapPin, b.package?.location],
                            [Calendar, new Date(b.travelDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })],
                            [Users, `${b.persons} Person${b.persons > 1 ? 's' : ''}`],
                            [Clock, b.package?.duration + ' Days'],
                          ].map(([Icon, val], i) => (
                            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}><Icon size={14} color="var(--accent)"/>{val}</span>
                          ))}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 12, borderTop: '1px solid var(--border-color)' }}>
                          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Booking ID: </span>
                          <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700, color: 'var(--text-main)' }}>{b.bookingId}</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: 12, marginTop: 24, alignItems: 'center', flexWrap: 'wrap' }}>
                        {b.status !== 'Cancelled' && (
                          <button onClick={() => cancelBooking(b._id)} style={{ padding: '10px 18px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 12, fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.25s' }}>
                            <XCircle size={14}/> Cancel Booking
                          </button>
                        )}
                        <button onClick={() => deleteBooking(b._id)} style={{ padding: '10px 18px', background: 'var(--gray-100)', color: 'var(--text-muted)', border: 'none', borderRadius: 12, fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.25s' }}>
                          <Trash2 size={14}/> Remove
                        </button>
                        {b.status === 'Confirmed' && (
                          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'var(--gray-100)', borderRadius: 40 }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{b.rating ? 'Trip Rated' : 'Rate Experience'}</span>
                            <div style={{ display: 'flex', gap: 2 }}>
                              {[1, 2, 3, 4, 5].map(star => (
                                <Star
                                  key={star}
                                  size={18}
                                  onClick={() => !b.rating && rateBooking(b._id, star)}
                                  fill={star <= (b.rating || 0) ? 'var(--accent)' : 'none'}
                                  color={star <= (b.rating || 0) ? 'var(--accent)' : 'var(--text-muted)'}
                                  style={{ cursor: b.rating ? 'default' : 'pointer' }}
                                />
                              ))}
                            </div>
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
        @media (max-width: 800px) {
          .booking-card-grid { grid-template-columns: 1fr !important; }
          .booking-card-grid img { height: 200px !important; }
        }
      `}</style>
    </div>
  );
}
