import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe (use your publishable key here)
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY || 'pk_test_123');

export default function BookingPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [pkg, setPkg] = useState(null);
  const [formData, setFormData] = useState({ 
    travelDate: '', 
    persons: 1, 
    children: 0,
    foodType: 'Veg',
    roomType: '3 Star'
  });
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoMsg, setPromoMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchPackage();
  }, [id]);

  const fetchPackage = async () => {
    try {
      const res = await api.get(`/packages/${id}`);
      if (res.data.success) setPkg(res.data.package);
    } catch (err) {
      console.error('Failed to fetch package', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.travelDate) {
      alert('Please select a travel date');
      return;
    }

    setProcessing(true);
    try {
      // 1. Create booking in backend
      const bookingRes = await api.post('/bookings', {
        packageId: id,
        ...formData
      });

      if (!bookingRes.data.success) {
        alert(bookingRes.data.message || 'Failed to create booking');
        setProcessing(false);
        return;
      }

      const bookingId = bookingRes.data.booking._id;

      // 2. Create Stripe Checkout Session
      const sessionRes = await api.post('/payment/create-checkout-session', { bookingId });
      
      if (!sessionRes.data.success) {
        alert(sessionRes.data.message || 'Failed to initialize payment');
        setProcessing(false);
        return;
      }

      // 3. Redirect to Stripe Checkout
      const stripe = await stripePromise;
      const result = await stripe.redirectToCheckout({
        sessionId: sessionRes.data.sessionId,
      });

      if (result.error) {
        alert(result.error.message);
        setProcessing(false);
      }
    } catch (err) {
      console.error('Booking error', err);
      alert('An error occurred during booking.');
      setProcessing(false);
    }
  };

  const handleApplyPromo = async () => {
    if (!promoCode) return;
    try {
      const res = await api.post('/promos/validate', { code: promoCode });
      if (res.data.success) {
        setPromoDiscount(res.data.discount);
        setPromoMsg(res.data.message);
      } else {
        setPromoDiscount(0);
        setPromoMsg(res.data.message || 'Invalid promo code');
      }
    } catch (err) {
      setPromoDiscount(0);
      setPromoMsg(err.response?.data?.message || 'Invalid promo code');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!pkg) return <div>Package not found</div>;

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Book {pkg.title}</h2>
      <p style={{ color: '#666' }}>Base Price: ₹{pkg.price} / adult</p>
      
      <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Travel Date:</label>
          <input
            type="date"
            required
            value={formData.travelDate}
            onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Adults:</label>
            <input
              type="number"
              min="1"
              value={formData.persons}
              onChange={(e) => setFormData({ ...formData, persons: parseInt(e.target.value) || 1 })}
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Children:</label>
            <input
              type="number"
              min="0"
              value={formData.children}
              onChange={(e) => setFormData({ ...formData, children: parseInt(e.target.value) || 0 })}
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '15px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Promo Code (Optional):</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
              placeholder="Enter code"
              style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc', textTransform: 'uppercase' }}
            />
            <button 
              type="button" 
              onClick={handleApplyPromo}
              style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Apply
            </button>
          </div>
          {promoMsg && (
            <div style={{ marginTop: '10px', color: promoDiscount > 0 ? 'green' : 'red', fontSize: '14px' }}>
              {promoMsg} {promoDiscount > 0 && `(${promoDiscount}% OFF)`}
            </div>
          )}
        </div>

        <button 
          type="submit" 
          disabled={processing}
          style={{ 
            width: '100%', 
            padding: '12px', 
            backgroundColor: processing ? '#6c757d' : '#28a745', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px', 
            cursor: processing ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          {processing ? 'Processing...' : `Pay ₹${Math.round(((pkg.price * formData.persons) + ((pkg.childPrice || 0) * formData.children)) * (1 - promoDiscount / 100))} & Book`}
        </button>
      </form>
    </div>
  );
}
