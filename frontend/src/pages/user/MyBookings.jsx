import React, { useState, useEffect, useRef } from 'react';
import api from '../../utils/api';
import jsPDF from 'jspdf';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewModal, setReviewModal] = useState({ isOpen: false, packageId: null });
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings/my');
      if (res.data.success) setBookings(res.data.bookings);
    } catch (err) {
      console.error('Failed to fetch bookings', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      const res = await api.put(`/bookings/${id}/cancel`);
      if (res.data.success) {
        alert('Booking cancelled successfully');
        fetchBookings();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/reviews', {
        packageId: reviewModal.packageId,
        rating: reviewData.rating,
        comment: reviewData.comment
      });
      if (res.data.success) {
        alert('Review submitted successfully!');
        setReviewModal({ isOpen: false, packageId: null });
        setReviewData({ rating: 5, comment: '' });
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit review');
    }
  };

  const downloadPDF = (booking) => {
    const doc = new jsPDF();
    const pkg = booking.package;

    // Header
    doc.setFillColor(0, 123, 255);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('VistaVoyage', 14, 20);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Travel Booking Confirmation', 14, 32);

    // Booking ID
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(`Booking ID: ${booking.bookingId || booking._id}`, 14, 55);

    // Divider
    doc.setDrawColor(0, 123, 255);
    doc.setLineWidth(0.5);
    doc.line(14, 60, 196, 60);

    // Package Details
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('Package Details', 14, 70);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(`Package: ${pkg?.title || 'N/A'}`, 14, 80);
    doc.text(`Travel Date: ${new Date(booking.travelDate).toLocaleDateString('en-IN', { dateStyle: 'long' })}`, 14, 90);
    doc.text(`Duration: ${pkg?.duration?.days || '-'} Days / ${pkg?.duration?.nights || '-'} Nights`, 14, 100);
    doc.text(`Destination: ${pkg?.destination?.city || '-'}, ${pkg?.destination?.country || '-'}`, 14, 110);

    // Divider
    doc.line(14, 118, 196, 118);

    // Traveler Details
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('Traveler Details', 14, 128);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(`Name: ${booking.name}`, 14, 138);
    doc.text(`Email: ${booking.email}`, 14, 148);
    doc.text(`Adults: ${booking.persons}  |  Children: ${booking.children || 0}`, 14, 158);
    doc.text(`Room Type: ${booking.roomType}  |  Food: ${booking.foodType}`, 14, 168);

    // Divider
    doc.line(14, 176, 196, 176);

    // Payment
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('Payment Summary', 14, 186);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    if (booking.discountAmount > 0) {
      doc.text(`Promo Code: ${booking.promoCode}  (Saved ₹${booking.discountAmount})`, 14, 196);
    }
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 100, 0);
    doc.text(`Total Amount: ₹${booking.totalAmount?.toLocaleString()}`, 14, booking.discountAmount > 0 ? 208 : 196);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Payment Status: ${booking.paymentStatus}`, 14, booking.discountAmount > 0 ? 218 : 206);

    // Footer
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text('Thank you for choosing VistaVoyage! Have a wonderful trip. ✈️', 14, 280);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 287);

    doc.save(`VistaVoyage_Booking_${booking.bookingId || booking._id}.pdf`);
  };

  if (loading) return <div>Loading bookings...</div>;

  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
      <h2>My Bookings</h2>
      {bookings.length === 0 ? (
        <p>You have no bookings yet.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ddd', backgroundColor: '#f9f9f9' }}>
              <th style={{ padding: '10px', textAlign: 'left' }}>Package</th>
              <th>Travel Date</th>
              <th>Status</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '10px' }}>{booking.package?.title || 'Unknown'}</td>
                <td style={{ textAlign: 'center' }}>{new Date(booking.travelDate).toLocaleDateString()}</td>
                <td style={{ textAlign: 'center' }}>
                  <span style={{ padding: '5px 10px', backgroundColor: booking.status === 'Confirmed' ? '#d4edda' : booking.status === 'Cancelled' ? '#f8d7da' : '#fff3cd', borderRadius: '5px' }}>
                    {booking.status}
                  </span>
                </td>
                <td style={{ textAlign: 'center' }}>₹{booking.totalAmount}</td>
                <td style={{ textAlign: 'center' }}>
                  {booking.status === 'Pending' && (
                    <button onClick={() => handleCancel(booking._id)} style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginRight: '5px' }}>Cancel</button>
                  )}
                  {booking.status === 'Confirmed' && (
                    <button onClick={() => setReviewModal({ isOpen: true, packageId: booking.package._id })} style={{ padding: '5px 10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginRight: '5px' }}>Leave Review</button>
                  )}
                  <button onClick={() => downloadPDF(booking)} style={{ padding: '5px 10px', backgroundColor: '#6f42c1', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>📄 PDF</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {reviewModal.isOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', width: '400px' }}>
            <h3>Write a Review</h3>
            <form onSubmit={submitReview}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Rating (1-5)</label>
                <input type="number" min="1" max="5" required value={reviewData.rating} onChange={(e) => setReviewData({ ...reviewData, rating: e.target.value })} style={{ width: '100%', padding: '8px' }} />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Comment</label>
                <textarea required rows="4" value={reviewData.comment} onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })} style={{ width: '100%', padding: '8px' }}></textarea>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button type="button" onClick={() => setReviewModal({ isOpen: false, packageId: null })} style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px' }}>Cancel</button>
                <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px' }}>Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
