import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const API_BASE = 'http://localhost:5000/api';

const downloadCSV = async (endpoint, filename, adminToken) => {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    alert('Failed to export CSV');
  }
};

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const adminToken = localStorage.getItem('adminToken');

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings');
      if (res.data.success) setBookings(res.data.bookings);
    } catch (err) {
      console.error('Failed to fetch bookings', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/bookings/${id}/status`, { status });
      fetchBookings();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const filtered = filter === 'All' ? bookings : bookings.filter(b => b.status === filter);

  if (loading) return <div style={{ padding: '40px' }}>Loading bookings...</div>;

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <h2 style={{ margin: 0 }}>📋 Manage Bookings ({bookings.length})</h2>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select value={filter} onChange={e => setFilter(e.target.value)}
            style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer' }}>
            {['All', 'Pending', 'Confirmed', 'Cancelled'].map(s => <option key={s}>{s}</option>)}
          </select>
          <button onClick={() => downloadCSV('/admin/export/bookings', 'bookings.csv', adminToken)}
            style={{ padding: '8px 16px', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
            ⬇ Export CSV
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#888', padding: '40px' }}>No bookings found.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
                <th style={{ padding: '12px 10px', textAlign: 'left' }}>Booking ID</th>
                <th style={{ padding: '12px 10px', textAlign: 'left' }}>User</th>
                <th style={{ padding: '12px 10px' }}>Package</th>
                <th style={{ padding: '12px 10px' }}>Travel Date</th>
                <th style={{ padding: '12px 10px' }}>Amount</th>
                <th style={{ padding: '12px 10px' }}>Status</th>
                <th style={{ padding: '12px 10px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(booking => (
                <tr key={booking._id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px', fontFamily: 'monospace', fontSize: '13px', color: '#555' }}>{booking.bookingId}</td>
                  <td style={{ padding: '10px' }}>
                    <div style={{ fontWeight: '600' }}>{booking.user?.name}</div>
                    <div style={{ color: '#888', fontSize: '12px' }}>{booking.user?.email}</div>
                  </td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>{booking.package?.title || 'N/A'}</td>
                  <td style={{ padding: '10px', textAlign: 'center', color: '#555' }}>{new Date(booking.travelDate).toLocaleDateString()}</td>
                  <td style={{ padding: '10px', textAlign: 'center', fontWeight: '600' }}>₹{booking.totalAmount?.toLocaleString()}</td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>
                    <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '13px', fontWeight: '600',
                      backgroundColor: booking.status === 'Confirmed' ? '#d4edda' : booking.status === 'Cancelled' ? '#f8d7da' : '#fff3cd',
                      color: booking.status === 'Confirmed' ? '#155724' : booking.status === 'Cancelled' ? '#721c24' : '#856404' }}>
                      {booking.status}
                    </span>
                  </td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>
                    <select
                      value={booking.status}
                      onChange={e => updateStatus(booking._id, e.target.value)}
                      style={{ padding: '5px 8px', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}
                    >
                      <option>Pending</option>
                      <option>Confirmed</option>
                      <option>Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
