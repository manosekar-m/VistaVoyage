import React from 'react';

export default function AdminFeedback() {
  const feedbacks = [
    { id: 1, user: 'John Doe', rating: 5, comment: 'Amazing experience!' },
    { id: 2, user: 'Jane Smith', rating: 4, comment: 'Good service' },
  ];

  return (
    <div style={{ padding: '40px' }}>
      <h2>Customer Feedback</h2>
      {feedbacks.map((feedback) => (
        <div key={feedback.id} style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '15px' }}>
          <strong>{feedback.user}</strong> - {'⭐'.repeat(feedback.rating)}
          <p>{feedback.comment}</p>
        </div>
      ))}
    </div>
  );
}
