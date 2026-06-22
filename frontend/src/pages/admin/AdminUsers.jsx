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

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const adminToken = localStorage.getItem('adminToken');

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      if (res.data.success) setUsers(res.data.users);
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user? This action cannot be undone.')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      fetchUsers();
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div style={{ padding: '40px' }}>Loading users...</div>;

  return (
    <div style={{ padding: '40px', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <h2 style={{ margin: 0 }}>👥 Manage Users ({users.length})</h2>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', width: '220px' }}
          />
          <button onClick={() => downloadCSV('/admin/export/users', 'users.csv', adminToken)}
            style={{ padding: '8px 16px', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
            ⬇ Export CSV
          </button>
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
            <th style={{ padding: '12px 10px', textAlign: 'left' }}>Name</th>
            <th style={{ padding: '12px 10px', textAlign: 'left' }}>Email</th>
            <th style={{ padding: '12px 10px' }}>Phone</th>
            <th style={{ padding: '12px 10px' }}>Joined</th>
            <th style={{ padding: '12px 10px' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(user => (
            <tr key={user._id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '12px 10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#007bff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', flexShrink: 0 }}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontWeight: '600' }}>{user.name}</span>
                </div>
              </td>
              <td style={{ padding: '12px 10px', color: '#555' }}>{user.email}</td>
              <td style={{ padding: '12px 10px', textAlign: 'center', color: '#555' }}>{user.phone || '—'}</td>
              <td style={{ padding: '12px 10px', textAlign: 'center', color: '#888', fontSize: '13px' }}>{new Date(user.createdAt).toLocaleDateString()}</td>
              <td style={{ padding: '12px 10px', textAlign: 'center' }}>
                <button onClick={() => handleDelete(user._id)}
                  style={{ padding: '5px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
