import React, { useEffect, useState } from 'react';
import { Search, Trash2, User, Mail, Phone, Calendar } from 'lucide-react';
import AdminLayout from '../../components/shared/AdminLayout';
import api from '../../utils/api';

export default function AdminUsers() {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');

  const fetchUsers = () => {
    setLoading(true);
    api.get('/admin/users')
      .then(r => setUsers(r.data.users || []))
      .catch(e => { console.error('Users error:', e); alert(e.response?.data?.message || 'Failed to load users'); })
      .finally(() => setLoading(false));
  };
  useEffect(() => { fetchUsers(); }, []);

  const deleteUser = async id => {
    if (!window.confirm('Delete this user? Their bookings will remain.')) return;
    await api.delete(`/admin/users/${id}`);
    fetchUsers();
  };

  const filtered = users.filter(u =>
    !search || [u.name, u.email, u.phone].some(v => v?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <AdminLayout>
      <div style={{ padding: 32 }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: '2rem', color: 'var(--text-main)', fontFamily: 'Cormorant Garamond' }}>Users</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>{users.length} registered users</p>
        </div>

        <div style={{ background: 'var(--bg-card)', borderRadius: 16, padding: '14px 20px', boxShadow: 'var(--shadow)', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10, border: '1px solid var(--border-color)' }}>
          <Search size={15} color="var(--text-muted)"/>
          <input style={{ border: 'none', outline: 'none', fontFamily: 'DM Sans', fontSize: 14, width: '100%', background: 'transparent', color: 'var(--text-main)' }}
            placeholder="Search users by name, email or phone..." value={search} onChange={e => setSearch(e.target.value)}/>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 80 }}><div className="spinner"/></div>
        ) : (
          <div style={{ background: 'var(--bg-card)', borderRadius: 16, boxShadow: 'var(--shadow)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
                <thead>
                  <tr style={{ background: 'var(--gray-50)', borderBottom: '1px solid var(--border-color)' }}>
                    {['User','Email','Phone','Registered','Action'].map(h => (
                      <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={5} style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>No users found</td></tr>
                  ) : filtered.map((u, i) => (
                    <tr key={u._id} style={{ borderBottom: '1px solid var(--border-color)', background: i % 2 === 0 ? 'var(--bg-card)' : 'var(--gray-50)' }}>
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: 14 }}>{u.name?.charAt(0)}</span>
                          </div>
                          <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-main)' }}>{u.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 20px', fontSize: 13, color: 'var(--text-muted)' }}>{u.email}</td>
                      <td style={{ padding: '14px 20px', fontSize: 13, color: 'var(--text-muted)' }}>{u.phone}</td>
                      <td style={{ padding: '14px 20px', fontSize: 13, color: 'var(--text-muted)' }}>
                        {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <button onClick={() => deleteUser(u._id)} style={{ background: 'rgba(239,68,68,0.1)', border: 'none', borderRadius: 8, padding: '6px 12px', color: 'var(--danger)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontFamily: 'DM Sans', fontWeight: 600 }}>
                          <Trash2 size={13}/> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
