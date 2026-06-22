import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>Welcome to VistaVoyage</h1>
      <p style={{ fontSize: '18px', marginBottom: '30px' }}>
        Discover the world's most amazing travel packages
      </p>
      <Link to="/packages" style={{
        padding: '12px 30px',
        backgroundColor: '#007bff',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '5px',
        fontSize: '16px'
      }}>
        Explore Packages
      </Link>
      <div style={{ marginTop: '50px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h3>🌍 500+ Destinations</h3>
          <p>Explore to any corner of the world</p>
        </div>
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h3>✈️ Easy Booking</h3>
          <p>Simple and secure booking process</p>
        </div>
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h3>💰 Best Prices</h3>
          <p>Get the best deals on travel packages</p>
        </div>
      </div>
    </div>
  );
}
