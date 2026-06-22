import React, { useState, useEffect } from 'react';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // Fetch user bookings
    const mockBookings = [
      { id: 1, packageName: 'Paris Adventure', date: '2026-05-15', status: 'Confirmed' },
      { id: 2, packageName: 'Tokyo Exploration', date: '2026-06-20', status: 'Pending' },
    ];
    setBookings(mockBookings);
  }, []);

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>My Bookings</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ddd' }}>
            <th style={{ padding: '10px', textAlign: 'left' }}>Package</th>
            <th>Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '10px' }}>{booking.packageName}</td>
              <td>{booking.date}</td>
              <td><span style={{ padding: '5px 10px', backgroundColor: booking.status === 'Confirmed' ? '#d4edda' : '#fff3cd', borderRadius: '5px' }}>{booking.status}</span></td>
              <td><button style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Cancel</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
