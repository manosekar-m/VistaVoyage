import React, { useState } from 'react';

export default function FeedbackPage() {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Feedback submitted! Thank you for your review.');
    setComment('');
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px' }}>
      <h2>Share Your Feedback</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Rating:</label>
          <select value={rating} onChange={(e) => setRating(e.target.value)} style={{ width: '100%', padding: '8px' }}>
            <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
            <option value="4">⭐⭐⭐⭐ Good</option>
            <option value="3">⭐⭐⭐ Average</option>
            <option value="2">⭐⭐ Poor</option>
            <option value="1">⭐ Terrible</option>
          </select>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Your Feedback:</label>
          <textarea value={comment} onChange={(e) => setComment(e.target.value)} style={{ width: '100%', padding: '8px', height: '150px' }} placeholder="Share your experience..." required />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Submit Feedback</button>
      </form>
    </div>
  );
}
