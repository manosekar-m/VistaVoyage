import React from 'react';

export default function AdminProfile() {
  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px' }}>
      <h2>Admin Profile</h2>
      <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
        <p><strong>Name:</strong> Admin User</p>
        <p><strong>Email:</strong> admin@vistavoyage.com</p>
        <p><strong>Role:</strong> Administrator</p>
        <p><strong>Joined:</strong> 2025-01-01</p>
      </div>
    </div>
  );
}
