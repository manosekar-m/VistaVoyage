import React from 'react';

export default function AdminPackages() {
  const packages = [
    { id: 1, name: 'Paris Adventure', price: '$999', duration: '5 days' },
    { id: 2, name: 'Tokyo Exploration', price: '$1299', duration: '7 days' },
  ];

  return (
    <div style={{ padding: '40px' }}>
      <h2>Manage Packages</h2>
      <button style={{ marginBottom: '20px', padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>+ Add Package</button>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
            <th style={{ padding: '10px', textAlign: 'left' }}>Name</th>
            <th>Price</th>
            <th>Duration</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {packages.map((pkg) => (
            <tr key={pkg.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '10px' }}>{pkg.name}</td>
              <td>{pkg.price}</td>
              <td>{pkg.duration}</td>
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
