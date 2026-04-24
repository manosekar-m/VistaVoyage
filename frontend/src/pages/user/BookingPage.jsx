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
        <div style={{ background: 'var(--bg-card)', padding: '20px 32px', borderRadius: '0 0 24px 24px', boxShadow: 'var(--shadow)', marginBottom: 36, display: 'flex', alignItems: 'center', borderTop: '2px solid var(--accent)' }}>
          {STEPS.map((label, i) => {
            const n = i + 1, done = step > n, active = step === n;
            return (
              <React.Fragment key={label}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: done ? 'var(--success)' : active ? 'linear-gradient(135deg, var(--accent), var(--accent-light))' : 'var(--gray-100)', color: done ? 'white' : active ? '#1a3a4a' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 15, flexShrink: 0, transition: 'all 0.4s', boxShadow: active ? 'var(--shadow)' : 'none' }}>
                    {done ? <CheckCircle size={20}/> : n}
                  </div>
                  <span style={{ fontSize: 14, fontWeight: active ? 800 : 600, color: active ? 'var(--text-main)' : 'var(--text-muted)', transition: 'all 0.3s', whiteSpace: 'nowrap' }}>{label}</span>
                </div>
                {i < 2 && <div style={{ flex: 1, height: 2, background: done ? 'var(--success)' : 'var(--border-color)', margin: '0 24px', transition: 'background 0.5s', borderRadius: 4 }}/>}
              </React.Fragment>
            );
          })}
        </div>

        {/* Price Summary pill */}
        {step < 3 && (
          <div style={{ background: 'var(--bg-card)', borderRadius: 20, padding: '20px 32px', marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: 'var(--shadow)', border: '1px solid var(--border-color)', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 4 }}>Adults</div>
                <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: 15 }}>{form.adults} × ₹{pkg.price?.toLocaleString()}</div>
              </div>
              {form.children > 0 && (
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 4 }}>Children</div>
                  <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: 15 }}>{form.children} × ₹{childCost?.toLocaleString()}</div>
                </div>
              )}
              {discount > 0 && (
                <div>
                  <div style={{ fontSize: 11, color: 'var(--success)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 4 }}>Discount</div>
                  <div style={{ fontWeight: 700, color: 'var(--success)', fontSize: 15 }}>−₹{discount.toLocaleString()}</div>
                </div>
              )}
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 4 }}>Total Amount</div>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)' }}>₹{total.toLocaleString()}</div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ background: '#fff5f5', border: '1px solid #fecaca', color: '#dc2626', padding: '14px 20px', borderRadius: 14, marginBottom: 20, fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 10 }}>
            ⚠️ {error}
          </div>
        )}

        {/* ─── STEP 1: Trip Details ─── */}
        {step === 1 && (
          <div style={{ background: 'var(--bg-card)', borderRadius: 28, padding: '44px 48px', boxShadow: 'var(--shadow)', border: '1px solid var(--border-color)' }}>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: 'var(--text-main)', fontWeight: 700, marginBottom: 36 }}>Your Trip Details</h2>

            {/* Traveller info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
              <div>
                <label className="booking-label">Full Name</label>
                <input className="booking-input" value={user.name} readOnly style={{ background: 'var(--gray-100)', color: 'var(--text-muted)', cursor: 'not-allowed' }}/>
              </div>
              <div>
                <label className="booking-label">Email Address</label>
                <input className="booking-input" value={user.email} readOnly style={{ background: 'var(--gray-100)', color: 'var(--text-muted)', cursor: 'not-allowed' }}/>
              </div>
            </div>

            {/* Dates & Guests */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 24, marginBottom: 36 }}>
              <div>
                <label className="booking-label"><Calendar size={14} color="var(--accent)"/> Travel Date *</label>
                <div style={{ position: 'relative' }}>
                  <input className="booking-input" type="date" min={new Date().toISOString().split('T')[0]} value={form.travelDate} onChange={e => setForm({...form, travelDate: e.target.value})}/>
                </div>
              </div>
              <div>
                <label className="booking-label"><Users size={12} style={{ verticalAlign: 'middle', marginRight: 4 }}/>Adults *</label>
                <input className="booking-input" type="number" min={1} max={20} value={form.adults} onChange={e => setForm({...form, adults: Number(e.target.value)})}/>
              </div>
              <div>
                <label className="booking-label">Children (Under 12)</label>
                <input className="booking-input" type="number" min={0} max={10} value={form.children} onChange={e => setForm({...form, children: Number(e.target.value)})}/>
              </div>
            </div>

            {/* Food Preference */}
            {pkg.availableFoodOptions?.length > 0 && (
              <div style={{ marginBottom: 32 }}>
                <label className="booking-label"><Utensils size={12} style={{ verticalAlign: 'middle', marginRight: 6 }}/>Food Preference *</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                  {pkg.availableFoodOptions.map(opt => (
                    <div key={opt} className={`pref-box${form.foodPreference === opt ? ' active' : ''}`} onClick={() => setForm({...form, foodPreference: opt})}>
                      <div className="pref-box-emoji">{getEmoji('food', opt)}</div>
                      <div className="pref-box-label">{opt}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stay Preference */}
            {pkg.availableStayOptions?.length > 0 && (
              <div style={{ marginBottom: 36 }}>
                <label className="booking-label"><BedDouble size={12} style={{ verticalAlign: 'middle', marginRight: 6 }}/>Stay Preference *</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                  {pkg.availableStayOptions.map(opt => (
                    <div key={opt} className={`pref-box${form.stayPreference === opt ? ' active' : ''}`} onClick={() => setForm({...form, stayPreference: opt})}>
                      <div className="pref-box-emoji">{getEmoji('stay', opt)}</div>
                      <div className="pref-box-label">{opt}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Coupon */}
            <div style={{ background: 'var(--gray-100)', borderRadius: 20, padding: '28px 32px', marginBottom: 36, border: '1px solid var(--border-color)' }}>
              <label className="booking-label" style={{ marginBottom: 16 }}><Tag size={12} style={{ verticalAlign: 'middle', marginRight: 6 }}/>Promo Code</label>
              <div style={{ display: 'flex', gap: 12 }}>
                <input className="booking-input" style={{ textTransform: 'uppercase', letterSpacing: 2, fontWeight: 700, flex: 1 }} value={couponCode} onChange={e => setCouponCode(e.target.value.toUpperCase())} placeholder="ENTER CODE" disabled={discount > 0}/>
                {!discount ? (
                  <button type="button" onClick={handleApplyCoupon} disabled={validatingCoupon || !couponCode.trim()} style={{ padding: '0 28px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 14, cursor: (validatingCoupon || !couponCode.trim()) ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap', transition: 'all 0.25s', opacity: (validatingCoupon || !couponCode.trim()) ? 0.6 : 1 }}
                    onMouseEnter={e => { if (!validatingCoupon && couponCode.trim()) e.currentTarget.style.background = '#0a2540' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--primary)' }}>
                    {validatingCoupon ? <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }}/> : 'Apply'}
                  </button>
                ) : (
                  <button type="button" onClick={() => { setDiscount(0); setCouponCode(''); setCouponMsg({type:'',text:''}); }} style={{ padding: '0 20px', background: '#fff1f1', color: '#dc2626', border: '1.5px solid #fecaca', borderRadius: 14, cursor: 'pointer', fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap' }}>
                    Remove
                  </button>
                )}
              </div>
              {couponMsg.text && (
                <div style={{ marginTop: 14, fontSize: 14, color: couponMsg.type === 'success' ? 'var(--success)' : '#dc2626', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                  {couponMsg.text}
                </div>
              )}
            </div>

            <button onClick={confirmBooking} disabled={loading} style={{ width: '100%', padding: '20px', fontSize: 16, background: 'linear-gradient(135deg, var(--accent), var(--accent-light))', color: '#1a3a4a', border: 'none', borderRadius: 18, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.35s', boxShadow: 'var(--shadow)', opacity: loading ? 0.7 : 1 }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow)'; }}>
              {loading ? <div className="spinner" style={{ width: 22, height: 22, borderWidth: 2 }}/> : <><span>Proceed to Secure Payment</span> <ArrowRight size={20}/></>}
            </button>
          </div>
        )}

        {/* ─── STEP 2: Payment ─── */}
        {step === 2 && (
          <div style={{ background: 'var(--bg-card)', borderRadius: 28, padding: '44px 48px', boxShadow: 'var(--shadow)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: 'var(--text-main)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 14 }}>
                <Lock size={22} color="var(--success)"/> Secure Checkout
              </h2>
              <div style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--success)', padding: '7px 16px', borderRadius: 40, fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                🔒 SSL Encrypted
              </div>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 40, padding: '14px 20px', background: 'var(--gray-100)', borderRadius: 14, border: '1px solid var(--border-color)', fontWeight: 500 }}>
              <Sparkles size={14} style={{ verticalAlign: 'middle', marginRight: 6, color: 'var(--accent)' }}/>
              Demo mode: use any 16-digit number (e.g. 4111 1111 1111 1111)
            </p>

            {/* Credit Card Visual */}
            <div style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #0a2540 100%)', borderRadius: 24, padding: '36px 40px', marginBottom: 36, position: 'relative', overflow: 'hidden', minHeight: 180 }}>
              <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }}/>
              <div style={{ position: 'absolute', bottom: -60, left: -20, width: 250, height: 250, borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }}/>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40 }}>
                <CreditCard size={36} color="rgba(255,255,255,0.7)"/>
                <div style={{ textAlign: 'right', color: 'var(--accent)', fontWeight: 800, fontSize: 13, letterSpacing: 1.5, textTransform: 'uppercase' }}>Visa / Mastercard</div>
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: '1.6rem', color: 'white', letterSpacing: 4, marginBottom: 20, fontWeight: 600 }}>
                {card.number || '•••• •••• •••• ••••'}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1.5 }}>
                <span>{card.name || 'Cardholder Name'}</span>
                <span>{card.expiry || 'MM/YY'}</span>
              </div>
            </div>

            <div style={{ display: 'grid', gap: 24 }}>
              <div>
                <label className="booking-label">Card Number</label>
                <div className="card-input-wrap">
                  <CreditCard size={18} className="card-icon"/>
                  <input className="booking-input" style={{ paddingLeft: 48 }} placeholder="1234 5678 9012 3456" maxLength={19} value={card.number} onChange={e => setCard({...card, number: formatCard(e.target.value)})}/>
                </div>
              </div>
              <div>
                <label className="booking-label">Cardholder Name</label>
                <input className="booking-input" placeholder="Name on card" value={card.name} onChange={e => setCard({...card, name: e.target.value.replace(/[^a-zA-Z\s]/g, '')})}/>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div>
                  <label className="booking-label">Expiry Date</label>
                  <input className="booking-input" placeholder="MM/YY" maxLength={5} value={card.expiry} onChange={e => setCard({...card, expiry: formatExpiry(e.target.value)})}/>
                </div>
                <div>
                  <label className="booking-label">CVV / CVC</label>
                  <input className="booking-input" placeholder="•••" maxLength={3} type="password" value={card.cvv} onChange={e => setCard({...card, cvv: e.target.value.replace(/\D/g, '')})}/>
                </div>
              </div>
            </div>

            <button onClick={processPayment} disabled={loading} style={{ width: '100%', marginTop: 36, padding: '20px', fontSize: 17, background: 'linear-gradient(135deg, #c9a84c, #e6c76a)', color: 'var(--primary)', border: 'none', borderRadius: 18, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.35s', boxShadow: '0 10px 32px rgba(201,168,76,0.35)', letterSpacing: 0.5, opacity: loading ? 0.7 : 1 }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 18px 44px rgba(201,168,76,0.45)'; }}}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 32px rgba(201,168,76,0.35)'; }}>
              {loading ? <div className="spinner" style={{ width: 22, height: 22, borderWidth: 2, borderTopColor: 'var(--primary)' }}/> : <><Lock size={20}/> <span>Pay ₹{total.toLocaleString()} Now</span></>}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', marginTop: 20 }}>
              <Shield size={14} color="var(--success)"/>
              <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>256-bit SSL · PCI Compliant · 100% Secure</span>
            </div>
          </div>
        )}

        {/* ─── STEP 3: Success ─── */}
        {step === 3 && (
          <div style={{ background: 'var(--bg-card)', borderRadius: 28, padding: '64px 48px', boxShadow: 'var(--shadow)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
            <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'linear-gradient(135deg, var(--success), #065f46)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px', boxShadow: 'var(--shadow)' }}>
              <CheckCircle size={52} color="white" strokeWidth={1.5}/>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(16,185,129,0.1)', padding: '8px 20px', borderRadius: 40, color: 'var(--success)', fontSize: 13, fontWeight: 800, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 24 }}>
              <Sparkles size={14}/> Booking Confirmed
            </div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '3rem', color: 'var(--text-main)', marginBottom: 16, fontWeight: 700 }}>You're All Set! 🎉</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: 40, fontSize: 17, lineHeight: 1.7, maxWidth: 500, margin: '0 auto 40px' }}>
              Your journey to <strong style={{ color: 'var(--primary)' }}>{pkg.title}</strong> has been confirmed. A confirmation has been sent to your email.
            </p>

            <div style={{ background: 'linear-gradient(135deg, var(--primary), #0a2540)', borderRadius: 20, padding: '28px 40px', marginBottom: 40, display: 'inline-block' }}>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>Booking Reference</div>
              <div style={{ fontFamily: 'monospace', fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent)', letterSpacing: 3 }}>{booking?.bookingId}</div>
            </div>

            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/my-bookings')} style={{ padding: '16px 36px', background: 'linear-gradient(135deg, var(--accent), var(--accent-light))', color: '#1a3a4a', border: 'none', borderRadius: 14, cursor: 'pointer', fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.3s', boxShadow: 'var(--shadow)' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow)'; }}>
                View My Bookings <ChevronRight size={18}/>
              </button>
              <button onClick={() => navigate('/packages')} style={{ padding: '16px 36px', background: 'transparent', color: 'var(--text-main)', border: '2px solid var(--border-color)', borderRadius: 14, cursor: 'pointer', fontWeight: 700, fontSize: 15, transition: 'all 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--text-main)'; }}>
                Explore More
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
