import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CreditCard, CheckCircle, ArrowRight, Lock, Tag, Utensils, BedDouble, Users, Calendar, ChevronRight, Shield, Sparkles } from 'lucide-react';
import api from '../../utils/api';

const STEPS = ['Trip Details', 'Payment', 'Confirmed'];

export default function BookingPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pkg, setPkg]     = useState(null);
  const [step, setStep]   = useState(1);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm]   = useState({ travelDate: '', adults: 1, children: 0, foodPreference: '', stayPreference: '' });
  const [card, setCard]   = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState({ type: '', text: '' });
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    api.get(`/packages/${id}`).then(r => setPkg(r.data.package));
  }, [id]);

  const childCost = pkg ? (pkg.childPrice || Math.round(pkg.price * 0.5)) : 0;
  const rawTotal  = pkg ? (pkg.price * form.adults) + (childCost * form.children) : 0;
  const total     = Math.max(0, rawTotal - discount);

  const confirmBooking = async () => {
    if (!form.travelDate) return setError('Please select a travel date');
    if (pkg.availableFoodOptions?.length > 0 && !form.foodPreference) return setError('Please select your food preference');
    if (pkg.availableStayOptions?.length > 0 && !form.stayPreference) return setError('Please select your stay preference');
    setError(''); setLoading(true);
    try {
      const { data } = await api.post('/bookings', {
        packageId: id, travelDate: form.travelDate,
        adults: form.adults, children: form.children,
        couponCode: couponCode.trim(),
        foodPreference: form.foodPreference, stayPreference: form.stayPreference
      });
      setBooking(data.booking);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally { setLoading(false); }
  };

  const handleApplyCoupon = async () => {
    const trimmed = couponCode.trim().toUpperCase().replace(/\s/g, '');
    if (!trimmed) return;
    setCouponMsg({ type: '', text: '' });
    setValidatingCoupon(true);
    try {
      const { data } = await api.post('/coupons/apply', { code: trimmed });
      if (data.success) {
        setDiscount(data.discountAmount);
        setCouponMsg({ type: 'success', text: `🎉 Coupon applied! You saved ₹${data.discountAmount}` });
      }
    } catch (err) {
      setDiscount(0);
      setCouponMsg({ type: 'error', text: err.response?.data?.message || 'Invalid coupon code' });
    } finally {
      setValidatingCoupon(false);
    }
  };

  const formatCard = v => v.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim();
  const formatExpiry = v => {
    let digits = v.replace(/\D/g, '');
    if (digits.length > 2) {
      return digits.substring(0, 2) + '/' + digits.substring(2, 4);
    }
    return digits;
  };

  const getEmoji = (type, opt) => {
    const lower = opt.toLowerCase();
    if (type === 'food') {
      if (lower.includes('non-veg')) return '🍗';
      if (lower.includes('vegan')) return '🥗';
      if (lower.includes('jain')) return '🥬';
      return '🍲';
    } else {
      if (lower.includes('suite')) return '👑';
      if (lower.includes('deluxe')) return '✨';
      if (lower.includes('standard')) return '🛏️';
      if (lower.includes('resort')) return '🛏️';
      return '🏨';
    }
  };

  const processPayment = async () => {
    if (!card.number || !card.name || !card.expiry || !card.cvv) {
      return setError('Please fill in all payment details');
    }
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/payment/process', {
        bookingId: booking._id,
        cardNumber: card.number,
        cardName: card.name,
        expiry: card.expiry,
        cvv: card.cvv
      });
      
      if (data.success) {
        setBooking(data.booking);
        setStep(3);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Payment processing failed. Please check your card details.');
    } finally {
      setLoading(false);
    }
  };

  if (!pkg) return (
    <div style={{ paddingTop: 120, textAlign: 'center', minHeight: '100vh', background: 'var(--bg-page)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div>
        <div className="spinner" style={{ width: 44, height: 44, borderWidth: 3, margin: '0 auto 16px' }}/>
        <p style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Loading booking details...</p>
      </div>
    </div>
  );

  return (
    <div style={{ paddingTop: 72, minHeight: '100vh', background: 'var(--bg-page)', paddingBottom: 80, color: 'var(--text-main)', transition: 'all 0.3s' }}>
      <style>{`
        .booking-input { width: 100%; padding: 14px 18px; border: 1.5px solid var(--border-color); border-radius: 14px; font-size: 15px; color: var(--text-main); background: var(--bg-card); outline: none; transition: all 0.3s; font-family: inherit; box-sizing: border-box; }
        .booking-input:focus { border-color: var(--accent); box-shadow: 0 0 0 4px rgba(201,168,76,0.1); }
        .booking-input[type="date"] { cursor: pointer; }
        .booking-label { display: block; font-size: 12px; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 10px; display: flex; align-items: center; gap: 6px; }
        .card-input-wrap { position: relative; }
        .card-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--text-muted); opacity: 0.7; }
        .pref-box { padding: 18px 12px; border-radius: 18px; border: 2px solid var(--border-color); background: var(--bg-card); cursor: pointer; transition: all 0.25s; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; flex: 1; min-width: 110px; max-width: 140px; text-align: center; }
        .pref-box:hover { border-color: var(--accent); transform: translateY(-4px); box-shadow: var(--shadow); }
        .pref-box.active { border-color: var(--accent); background: rgba(201,168,76,0.08); box-shadow: 0 0 0 1px var(--accent); }
        .pref-box-emoji { font-size: 30px; line-height: 1; transition: transform 0.25s; }
        .pref-box:hover .pref-box-emoji, .pref-box.active .pref-box-emoji { transform: scale(1.15); }
        .pref-box-label { font-size: 13px; font-weight: 700; color: var(--text-main); }
      `}</style>

      {/* Dark header strip with package name */}
      <div style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #0a2540 100%)', padding: '32px 0', marginBottom: 0 }}>
        <div className="container" style={{ padding: '0 24px' }}>
          <div style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>Booking Journey</div>
          <div style={{ color: 'white', fontFamily: 'Cormorant Garamond, serif', fontSize: '2.2rem', fontWeight: 700, lineHeight: 1.1 }}>{pkg.title}</div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, marginTop: 8, fontWeight: 500 }}>{pkg.location} · {pkg.duration} Days{pkg.nights ? ` / ${pkg.nights} Nights` : ''}</div>
        </div>
      </div>

      <div className="container" style={{ padding: '0 24px', maxWidth: 860 }}>

      {/* Step Progress */}
      <div style={{ background: 'var(--bg-card)', padding: '20px 24px', borderRadius: '0 0 24px 24px', boxShadow: 'var(--shadow)', marginBottom: 24, display: 'flex', alignItems: 'center', borderTop: '2px solid var(--accent)', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        {STEPS.map((label, i) => {
          const n = i + 1, done = step > n, active = step === n;
          return (
            <React.Fragment key={label}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: done ? 'var(--success)' : active ? 'linear-gradient(135deg, var(--accent), var(--accent-light))' : 'var(--gray-100)', color: done ? 'white' : active ? '#1a3a4a' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, flexShrink: 0 }}>
                  {done ? <CheckCircle size={18}/> : n}
                </div>
                <span className="desktop-nav" style={{ fontSize: 13, fontWeight: active ? 800 : 600, color: active ? 'var(--text-main)' : 'var(--text-muted)' }}>{label}</span>
              </div>
              {i < 2 && <div style={{ flex: 1, minWidth: 20, height: 2, background: done ? 'var(--success)' : 'var(--border-color)', margin: '0 12px' }}/>}
            </React.Fragment>
          );
        })}
      </div>


      {/* ─── STEP 1: Trip Details ─── */}
      {step === 1 && (
          <div style={{ background: 'var(--bg-card)', borderRadius: 24, padding: '32px 24px', boxShadow: 'var(--shadow)', border: '1px solid var(--border-color)' }}>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'var(--text-main)', fontWeight: 700, marginBottom: 24 }}>Your Trip Details</h2>

            {/* Traveller info */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 24 }}>
              <div>
                <label className="booking-label">Full Name</label>
                <input className="booking-input" value={user.name} readOnly style={{ background: 'var(--gray-100)', color: 'var(--text-muted)' }}/>
              </div>
              <div>
                <label className="booking-label">Email Address</label>
                <input className="booking-input" value={user.email} readOnly style={{ background: 'var(--gray-100)', color: 'var(--text-muted)' }}/>
              </div>
            </div>

            {/* Dates & Guests */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 20, marginBottom: 24 }}>
              <div>
                <label className="booking-label"><Calendar size={14} color="var(--accent)"/> Travel Date *</label>
                <input className="booking-input" type="date" min={new Date().toISOString().split('T')[0]} value={form.travelDate} onChange={e => setForm({...form, travelDate: e.target.value})}/>
              </div>
              <div>
                <label className="booking-label">Adults *</label>
                <input className="booking-input" type="number" min={1} value={form.adults} onChange={e => setForm({...form, adults: Number(e.target.value)})}/>
              </div>
              <div>
                <label className="booking-label">Children</label>
                <input className="booking-input" type="number" min={0} value={form.children} onChange={e => setForm({...form, children: Number(e.target.value)})}/>
              </div>
            </div>

            {/* Food Preference */}
            {pkg.availableFoodOptions?.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <label className="booking-label">Food Preference *</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 12 }}>
                  {pkg.availableFoodOptions.map(opt => (
                    <div key={opt} className={`pref-box${form.foodPreference === opt ? ' active' : ''}`} onClick={() => setForm({...form, foodPreference: opt})} style={{ maxWidth: 'none' }}>
                      <div className="pref-box-emoji" style={{ fontSize: 24 }}>{getEmoji('food', opt)}</div>
                      <div className="pref-box-label" style={{ fontSize: 12 }}>{opt}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stay Preference */}
            {pkg.availableStayOptions?.length > 0 && (
              <div style={{ marginBottom: 32 }}>
                <label className="booking-label">Stay Preference *</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 12 }}>
                  {pkg.availableStayOptions.map(opt => (
                    <div key={opt} className={`pref-box${form.stayPreference === opt ? ' active' : ''}`} onClick={() => setForm({...form, stayPreference: opt})} style={{ maxWidth: 'none' }}>
                      <div className="pref-box-emoji" style={{ fontSize: 24 }}>{getEmoji('stay', opt)}</div>
                      <div className="pref-box-label" style={{ fontSize: 12 }}>{opt}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Coupon */}
            <div style={{ background: 'var(--gray-100)', borderRadius: 20, padding: '24px', marginBottom: 32 }}>
              <label className="booking-label">Promo Code</label>
              <div style={{ display: 'flex', gap: 12 }}>
                <input className="booking-input" style={{ textTransform: 'uppercase', flex: 1 }} value={couponCode} onChange={e => setCouponCode(e.target.value.toUpperCase())} placeholder="ENTER CODE"/>
                <button type="button" onClick={handleApplyCoupon} style={{ padding: '0 20px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 13 }}>Apply</button>
              </div>
            </div>

            <button onClick={confirmBooking} disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: 18, fontSize: 16 }}>
              {loading ? 'Processing...' : 'Proceed to Payment'}
            </button>
          </div>
        )}

        {/* ─── STEP 2: Payment ─── */}
        {step === 2 && (
          <div style={{ background: 'var(--bg-card)', borderRadius: 24, padding: '32px 24px', boxShadow: 'var(--shadow)', border: '1px solid var(--border-color)' }}>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'var(--text-main)', fontWeight: 700, marginBottom: 24 }}>Secure Payment</h2>
            
            {/* Credit Card Visual */}
            <div style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #0a2540 100%)', borderRadius: 20, padding: '24px', marginBottom: 24, color: 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                <CreditCard size={32} opacity={0.7}/>
                <span style={{ fontSize: 12, fontWeight: 800 }}>VISTA SECURE</span>
              </div>
              <div style={{ fontSize: '1.4rem', letterSpacing: 3, marginBottom: 20 }}>{card.number || '•••• •••• •••• ••••'}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, opacity: 0.7 }}>
                <span>{card.name || 'CARDHOLDER'}</span>
                <span>{card.expiry || 'MM/YY'}</span>
              </div>
            </div>

            <div style={{ display: 'grid', gap: 20 }}>
              <div>
                <label className="booking-label">Card Number</label>
                <input className="booking-input" placeholder="1234 5678 9012 3456" value={card.number} onChange={e => setCard({...card, number: formatCard(e.target.value)})}/>
              </div>
              <div>
                <label className="booking-label">Cardholder Name</label>
                <input className="booking-input" placeholder="NAME ON CARD" value={card.name} onChange={e => setCard({...card, name: e.target.value.toUpperCase()})}/>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div>
                  <label className="booking-label">Expiry</label>
                  <input className="booking-input" placeholder="MM/YY" value={card.expiry} onChange={e => setCard({...card, expiry: formatExpiry(e.target.value)})}/>
                </div>
                <div>
                  <label className="booking-label">CVV</label>
                  <input className="booking-input" type="password" placeholder="•••" value={card.cvv} onChange={e => setCard({...card, cvv: e.target.value.replace(/\D/g,'')})}/>
                </div>
              </div>
            </div>

            <button onClick={processPayment} disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: 18, marginTop: 32, background: 'var(--accent)', color: 'var(--primary)' }}>
              {loading ? 'Processing...' : `Pay ₹${total.toLocaleString()}`}
            </button>
          </div>
        )}

        {/* ─── STEP 3: Success ─── */}
        {step === 3 && (
          <div style={{ background: 'var(--bg-card)', borderRadius: 24, padding: '48px 24px', boxShadow: 'var(--shadow)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <CheckCircle size={40} color="white"/>
            </div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.2rem', marginBottom: 12 }}>Booking Confirmed!</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: 32 }}>Your adventure is ready. A confirmation email has been sent.</p>
            
            <div style={{ background: 'var(--gray-100)', padding: '20px', borderRadius: 16, marginBottom: 32 }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>REFERENCE NUMBER</div>
              <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: 2 }}>{booking?.bookingId}</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button onClick={() => navigate('/my-bookings')} className="btn btn-primary">My Bookings</button>
              <button onClick={() => navigate('/')} className="btn btn-outline">Back to Home</button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
