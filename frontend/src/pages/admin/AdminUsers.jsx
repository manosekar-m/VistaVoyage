import React from 'react';

export default function AdminUsers() {
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', joined: '2026-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', joined: '2026-02-20' },
  ];

  return (
    <div style={{ padding: '40px' }}>
      <h2>Manage Users</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
            <th style={{ padding: '10px', textAlign: 'left' }}>Name</th>
            <th>Email</th>
            <th>Joined</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '10px' }}>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.joined}</td>
              <td><button style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Deactivate</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
