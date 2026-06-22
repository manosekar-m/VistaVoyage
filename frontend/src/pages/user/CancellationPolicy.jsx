import React from 'react';

export default function CancellationPolicy() {
  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Cancellation Policy</h1>
      <h3>Booking Cancellations</h3>
      <p>Cancellations must be made at least 30 days before travel date to receive a full refund.</p>
      <h3>Refund Timeline</h3>
      <ul>
        <li>30+ days before: 100% refund</li>
        <li>15-29 days before: 75% refund</li>
        <li>7-14 days before: 50% refund</li>
        <li>Less than 7 days: No refund</li>
      </ul>
      <h3>Contact Us</h3>
      <p>For cancellations or modifications, please contact our support team at support@vistavoyage.com</p>
    </div>
  );
}
