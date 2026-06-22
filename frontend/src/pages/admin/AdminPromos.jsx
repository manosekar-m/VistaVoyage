import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

export default function AdminPromos() {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);
  const [form, setForm] = useState({ code: '', discount: '', expiryDate: '', isActive: true });

  useEffect(() => { fetchPromos(); }, []);

  const fetchPromos = async () => {
    try {
      const res = await api.get('/promos');
      if (res.data.success) setPromos(res.data.promos);
    } catch (err) {
      console.error('Failed to fetch promos', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPromo) {
        await api.put(`/promos/${editingPromo._id}`, form);
        alert('Promo updated!');
      } else {
        await api.post('/promos', form);
        alert('Promo created!');
      }
      setShowForm(false);
      setEditingPromo(null);
      setForm({ code: '', discount: '', expiryDate: '', isActive: true });
      fetchPromos();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save promo');
    }
  };

  const handleEdit = (promo) => {
    setEditingPromo(promo);
    setForm({
      code: promo.code,
      discount: promo.discount,
      expiryDate: promo.expiryDate ? new Date(promo.expiryDate).toISOString().split('T')[0] : '',
      isActive: promo.isActive,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this promo code?')) return;
    try {
      await api.delete(`/promos/${id}`);
      fetchPromos();
    } catch (err) {
      alert('Failed to delete promo');
    }
  };

  const toggleActive = async (promo) => {
    try {
      await api.put(`/promos/${promo._id}`, { ...promo, isActive: !promo.isActive });
      fetchPromos();
    } catch (err) {
      alert('Failed to toggle promo');
    }
  };

  if (loading) return <div style={{ padding: '40px' }}>Loading promos...</div>;

  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ margin: 0 }}>🏷️ Manage Promo Codes</h2>
        <button
          onClick={() => { setShowForm(!showForm); setEditingPromo(null); setForm({ code: '', discount: '', expiryDate: '', isActive: true }); }}
          style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
        >
          {showForm ? '✕ Cancel' : '+ New Promo'}
        </button>
      </div>

      {showForm && (
        <div style={{ backgroundColor: '#f8f9fa', padding: '24px', borderRadius: '12px', marginBottom: '24px', border: '1px solid #dee2e6' }}>
          <h3 style={{ marginTop: 0 }}>{editingPromo ? 'Edit Promo' : 'Create New Promo'}</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Promo Code</label>
                <input required value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. SUMMER20" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Discount (%)</label>
                <input required type="number" min="1" max="100" value={form.discount} onChange={e => setForm({ ...form, discount: e.target.value })}
                  placeholder="e.g. 20" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Expiry Date</label>
                <input type="date" value={form.expiryDate} onChange={e => setForm({ ...form, expiryDate: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} />
                  <span style={{ fontWeight: '600' }}>Active</span>
                </label>
              </div>
            </div>
            <button type="submit" style={{ padding: '10px 24px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
              {editingPromo ? 'Update Promo' : 'Create Promo'}
            </button>
          </form>
        </div>
      )}

      {promos.length === 0 ? (
        <p style={{ color: '#888', textAlign: 'center', padding: '40px' }}>No promo codes yet.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: '12px 10px', textAlign: 'left' }}>Code</th>
              <th style={{ padding: '12px 10px' }}>Discount</th>
              <th style={{ padding: '12px 10px' }}>Expiry</th>
              <th style={{ padding: '12px 10px' }}>Status</th>
              <th style={{ padding: '12px 10px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {promos.map(promo => (
              <tr key={promo._id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px 10px', fontWeight: '700', fontFamily: 'monospace', fontSize: '15px' }}>{promo.code}</td>
                <td style={{ padding: '12px 10px', textAlign: 'center' }}>
                  <span style={{ backgroundColor: '#d4edda', color: '#155724', padding: '4px 10px', borderRadius: '20px', fontWeight: '600' }}>{promo.discount}% OFF</span>
                </td>
                <td style={{ padding: '12px 10px', textAlign: 'center', color: '#666' }}>
                  {promo.expiryDate ? new Date(promo.expiryDate).toLocaleDateString() : 'No expiry'}
                </td>
                <td style={{ padding: '12px 10px', textAlign: 'center' }}>
                  <button onClick={() => toggleActive(promo)}
                    style={{ padding: '4px 12px', backgroundColor: promo.isActive ? '#28a745' : '#dc3545', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer', fontSize: '13px' }}>
                    {promo.isActive ? '✓ Active' : '✕ Inactive'}
                  </button>
                </td>
                <td style={{ padding: '12px 10px', textAlign: 'center' }}>
                  <button onClick={() => handleEdit(promo)}
                    style={{ marginRight: '8px', padding: '5px 12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Edit</button>
                  <button onClick={() => handleDelete(promo._id)}
                    style={{ padding: '5px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
