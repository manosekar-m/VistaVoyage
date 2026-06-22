import React from 'react';

export default function AdminPromos() {
  const promos = [
    { id: 1, code: 'SUMMER20', discount: '20%', expiry: '2026-08-31' },
    { id: 2, code: 'TRAVEL50', discount: '50%', expiry: '2026-07-31' },
  ];

  return (
    <div style={{ padding: '40px' }}>
      <h2>Manage Promotions</h2>
      <button style={{ marginBottom: '20px', padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>+ Add Promo</button>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
            <th style={{ padding: '10px', textAlign: 'left' }}>Code</th>
            <th>Discount</th>
            <th>Expiry</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {promos.map((promo) => (
            <tr key={promo.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '10px' }}>{promo.code}</td>
              <td>{promo.discount}</td>
              <td>{promo.expiry}</td>
              <td>
                <button style={{ marginRight: '5px', padding: '5px 10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Edit</button>
                <button style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
