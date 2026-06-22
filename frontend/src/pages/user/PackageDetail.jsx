import React from 'react';
import { useParams } from 'react-router-dom';

export default function PackageDetail() {
  const { id } = useParams();

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Package {id} Details</h1>
      <div style={{ marginRight: '20px', marginBottom: '20px' }}>
        <div style={{ height: '400px', backgroundColor: '#e0e0e0', marginBottom: '20px' }} />
        <h2>Destination Name</h2>
        <p>Duration: 5 days</p>
        <p>Price: \</p>
        <div>Description of the amazing package...</div>
        <button style={{ marginTop: '20px', padding: '12px 30px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Book Now
        </button>
      </div>
    </div>
  );
}
