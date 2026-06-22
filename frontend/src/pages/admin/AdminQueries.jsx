import React from 'react';

export default function AdminQueries() {
  const queries = [
    { id: 1, from: 'John Doe', subject: 'Booking Help', status: 'Open', date: '2026-04-20' },
    { id: 2, from: 'Jane Smith', subject: 'Package Info', status: 'Closed', date: '2026-04-19' },
  ];

  return (
    <div style={{ padding: '40px' }}>
      <h2>Customer Queries</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
            <th style={{ padding: '10px', textAlign: 'left' }}>From</th>
            <th>Subject</th>
            <th>Status</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {queries.map((query) => (
            <tr key={query.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '10px' }}>{query.from}</td>
              <td>{query.subject}</td>
              <td><span style={{ padding: '5px 10px', backgroundColor: query.status === 'Open' ? '#ffc107' : '#d4edda', borderRadius: '5px' }}>{query.status}</span></td>
              <td>{query.date}</td>
              <td><button style={{ padding: '5px 10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Reply</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
