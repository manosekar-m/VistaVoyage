import React from 'react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  return (
    <div style={{ padding: '40px' }}>
      <h1>Admin Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginTop: '30px' }}>
        <Link to="/admin/bookings" style={{ padding: '20px', backgroundColor: '#e3f2fd', borderRadius: '8px', textDecoration: 'none', color: 'black' }}>
          <h3>📅 Bookings</h3>
          <p>Manage all travel bookings</p>
        </Link>
        <Link to="/admin/packages" style={{ padding: '20px', backgroundColor: '#f3e5f5', borderRadius: '8px', textDecoration: 'none', color: 'black' }}>
          <h3>🎁 Packages</h3>
          <p>Manage travel packages</p>
        </Link>
        <Link to="/admin/users" style={{ padding: '20px', backgroundColor: '#e8f5e9', borderRadius: '8px', textDecoration: 'none', color: 'black' }}>
          <h3>👥 Users</h3>
          <p>Manage user accounts</p>
        </Link>
        <Link to="/admin/feedback" style={{ padding: '20px', backgroundColor: '#fff3e0', borderRadius: '8px', textDecoration: 'none', color: 'black' }}>
          <h3>⭐ Feedback</h3>
          <p>View customer feedback</p>
        </Link>
        <Link to="/admin/promos" style={{ padding: '20px', backgroundColor: '#fce4ec', borderRadius: '8px', textDecoration: 'none', color: 'black' }}>
          <h3>🏷️ Promotions</h3>
          <p>Manage promo codes</p>
        </Link>
        <Link to="/admin/queries" style={{ padding: '20px', backgroundColor: '#eceff1', borderRadius: '8px', textDecoration: 'none', color: 'black' }}>
          <h3>💬 Queries</h3>
          <p>Customer inquiries</p>
        </Link>
      </div>
    </div>
  );
}
