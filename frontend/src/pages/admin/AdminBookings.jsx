import React from 'react';

export default function AdminBookings() {
  const bookings = [
    { id: 1, user: 'John Doe', package: 'Paris', status: 'Confirmed', amount: '$999' },
    { id: 2, user: 'Jane Smith', package: 'Tokyo', status: 'Pending', amount: '$1299' },
  ];

  return (
    <div style={{ padding: '40px' }}>
      <h2>Manage Bookings</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
            <th style={{ padding: '10px', textAlign: 'left' }}>User</th>
            <th>Package</th>
            <th>Status</th>
            <th>Amount</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '10px' }}>{booking.user}</td>
              <td>{booking.package}</td>
              <td><span style={{ padding: '5px 10px', backgroundColor: booking.status === 'Confirmed' ? '#d4edda' : '#fff3cd', borderRadius: '5px' }}>{booking.status}</span></td>
              <td>{booking.amount}</td>
              <td><button style={{ padding: '5px 10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>View</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
