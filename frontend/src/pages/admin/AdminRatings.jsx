import React from 'react';

export default function AdminRatings() {
  return (
    <div style={{ padding: '40px' }}>
      <h2>Package Ratings</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '20px' }}>
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center' }}>
          <h3>Paris Adventure</h3>
          <p style={{ fontSize: '24px', color: '#ffc107' }}>⭐ 4.5/5</p>
          <p>128 reviews</p>
        </div>
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center' }}>
          <h3>Tokyo Exploration</h3>
          <p style={{ fontSize: '24px', color: '#ffc107' }}>⭐ 4.8/5</p>
          <p>95 reviews</p>
        </div>
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center' }}>
          <h3>Bali Getaway</h3>
          <p style={{ fontSize: '24px', color: '#ffc107' }}>⭐ 4.6/5</p>
          <p>142 reviews</p>
        </div>
      </div>
    </div>
  );
}
