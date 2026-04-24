import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, Clock, Users, CheckCircle, ArrowLeft, ArrowRight, Navigation, Sun, ChevronDown, ChevronUp, Sparkles, Shield, Star, Download, Globe, X } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useAuth } from '../../context/AuthContext';
import { useCurrency } from '../../context/CurrencyContext';
import api from '../../utils/api';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function PackageDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();
  const [pkg, setPkg]     = useState(null);
  const [loading, setLoading] = useState(true);
  
  const downloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // --- PREMIUM HEADER ---
    // Background for header
    doc.setFillColor(10, 37, 64); // Deep Navy
    doc.rect(0, 0, pageWidth, 45, 'F');
    
    // Brand Name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(28);
    doc.setTextColor(201, 168, 76); // Gold Accent
    doc.text('VISTAVOYAGE', pageWidth / 2, 22, { align: 'center' });
    
    // Tagline or Divider
    doc.setDrawColor(201, 168, 76);
    doc.setLineWidth(0.5);
    doc.line(pageWidth / 4, 26, (pageWidth * 3) / 4, 26);
    
    // Package Name
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255); // White
    doc.text(pkg.title.toUpperCase(), pageWidth / 2, 36, { align: 'center' });
    
    // --- CONTENT BODY ---
    let y = 60;
    
    // Quick Details Row
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(10, 37, 64);
    doc.text(`DESTINATION: ${pkg.location.toUpperCase()}`, 20, y);
    doc.text(`DURATION: ${pkg.duration} DAYS`, pageWidth - 20, y, { align: 'right' });
    y += 15;

    // Highlights Section with Card-like feel
    if (pkg.highlights?.length > 0) {
      doc.setDrawColor(230, 230, 230);
      doc.setFillColor(250, 250, 250);
      doc.roundedRect(15, y - 5, pageWidth - 30, (pkg.highlights.length * 7) + 15, 3, 3, 'FD');
      
      doc.setFontSize(14);
      doc.setTextColor(201, 168, 76);
      doc.text('EXCLUSIVE TRIP HIGHLIGHTS', 20, y + 5);
      y += 12;
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);
      pkg.highlights.forEach(h => {
        doc.text(`★  ${h}`, 25, y);
        y += 7;
      });
      y += 15;
    }

    // Inclusions
    if ((pkg.availableFoodOptions?.length > 0) || (pkg.availableStayOptions?.length > 0)) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(10, 37, 64);
      doc.text('PREMIUM INCLUSIONS', 20, y);
      y += 8;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(80, 80, 80);
      if (pkg.availableFoodOptions?.length > 0) {
        doc.text(`• Culinary: ${pkg.availableFoodOptions.join(' | ')}`, 25, y);
        y += 7;
      }
      if (pkg.availableStayOptions?.length > 0) {
        doc.text(`• Accommodation: ${pkg.availableStayOptions.join(' | ')}`, 25, y);
        y += 7;
      }
      y += 12;
    }

    // Itinerary Section
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(10, 37, 64);
    doc.text('YOUR CURATED ITINERARY', 20, y);
    y += 10;
    
    pkg.itinerary.forEach((day, idx) => {
      if (y > 260) { doc.addPage(); y = 20; }
      
      // Day Header
      doc.setFillColor(245, 245, 245);
      doc.rect(20, y - 5, pageWidth - 40, 8, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(201, 168, 76);
      doc.text(`DAY ${day.day || idx + 1}: ${day.title}`, 25, y + 1);
      y += 12;
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(70, 70, 70);
      day.activities.forEach(act => {
        if (y > 280) { doc.addPage(); y = 20; }
        doc.text(`- ${act}`, 30, y);
        y += 6;
      });
      y += 8;
    });

    // --- CONTACT US SECTION ---
    if (y > 230) { doc.addPage(); y = 20; }
    y += 10;
    doc.setDrawColor(201, 168, 76);
    doc.setLineWidth(0.5);
    doc.line(20, y, pageWidth - 20, y);
    y += 15;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(10, 37, 64);
    doc.text('READY TO START YOUR JOURNEY?', pageWidth / 2, y, { align: 'center' });
    y += 12;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);
    doc.text('Contact our travel experts today for bookings and customization.', pageWidth / 2, y, { align: 'center' });
    y += 10;

    // Contact Details Grid-like feel
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(201, 168, 76);
    doc.text('Email: info@vistavoyage.com', pageWidth / 3, y, { align: 'center' });
    doc.text('Phone: +91 99999 99999', (pageWidth * 2) / 3, y, { align: 'center' });
    y += 8;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('Visit us at: www.vistavoyage.com', pageWidth / 2, y, { align: 'center' });

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text('Generated by VistaVoyage - Your Gateway to the World', pageWidth / 2, 287, { align: 'center' });
    }
    
    doc.save(`${pkg.title}_Brochure.pdf`);
  };
  const [imgIdx, setImgIdx]   = useState(0);
  const [expandedDay, setExpandedDay] = useState(-1);
  const [expandedTip, setExpandedTip] = useState(-1);
  const [showActivities, setShowActivities] = useState(false);
  const [showItinerary, setShowItinerary] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [waitlistMode, setWaitlistMode] = useState(false);
  const [waitLoading, setWaitLoading] = useState(false);

  const fetchReviews = async () => {
    try {
      const { data } = await api.get(`/reviews/${id}`);
      if (data.success) setReviews(data.reviews);
    } catch (err) { console.error(err); }
  };

  const handleJoinWaitlist = async () => {
    if (!user) return navigate('/login');
    setWaitLoading(true);
    try {
      const { data } = await api.post('/bookings/waitlist', { packageId: pkg._id, travelDate: new Date() });
      if (data.success) {
        alert(data.message);
        setWaitlistMode(false);
      }
    } catch (err) {
      alert('Failed to join waitlist. Please try again.');
    } finally {
      setWaitLoading(false);
    }
  };

  useEffect(() => {
    api.get(`/packages/${id}`).then(r => setPkg(r.data.package)).finally(() => setLoading(false));
    fetchReviews();
  }, [id]);

  if (loading) return (
    <div style={{ paddingTop: 120, textAlign: 'center', background: 'var(--bg-page)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div>
        <div className="spinner" style={{ width: 44, height: 44, borderWidth: 3, margin: '0 auto 16px' }}/>
        <p style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Loading package details...</p>
      </div>
    </div>
  );
  if (!pkg) return <div style={{ paddingTop: 120, textAlign: 'center', color: 'var(--text-main)', background: 'var(--bg-page)', minHeight: '100vh' }}>Package not found</div>;

  const images = pkg.images?.length ? pkg.images : ['https://images.unsplash.com/photo-1506461883276-594a12b11cf3?w=1400'];
  const isSoldOut = pkg.bookedSlots >= pkg.totalSlots;
  const handleBook = () => user ? navigate(`/booking/${pkg._id}`) : navigate('/login');

  return (
    <div style={{ paddingTop: 72, minHeight: '100vh', background: 'var(--bg-page)', color: 'var(--text-main)', transition: 'all 0.3s ease' }}>
      <style>{`
        .itin-item { background: var(--bg-card); border-radius: 20px; overflow: hidden; border: 1px solid var(--border-color); transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1); }
        .itin-item:hover { box-shadow: var(--shadow-lg); }
        .gallery-btn { background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.25); border-radius: 50%; width: 54px; height: 54px; cursor: pointer; color: white; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(12px); transition: all 0.3s; }
        .gallery-btn:hover { background: rgba(255,255,255,0.25); transform: scale(1.05); }
        @media (max-width: 900px) { .detail-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      {/* Cinematic Hero Gallery */}
      <div style={{ position: 'relative', height: 620, overflow: 'hidden', background: '#0a1628' }}>
        <img
          key={imgIdx}
          src={images[imgIdx]}
          alt={pkg.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.82, animation: 'zoomIn 8s ease-out forwards' }}
        />
        <style>{`@keyframes zoomIn { from { transform: scale(1); } to { transform: scale(1.06); } }`}</style>

        {/* Multi-layer gradient */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(5,15,30,0.3) 0%, rgba(5,15,30,0.15) 40%, rgba(5,15,30,0.75) 80%, rgba(5,15,30,0.95) 100%)' }}/>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(5,15,30,0.4) 0%, transparent 60%)' }}/>

        {/* Nav arrows */}
        {images.length > 1 && (
          <>
            <button className="gallery-btn" onClick={() => setImgIdx((imgIdx - 1 + images.length) % images.length)} style={{ position: 'absolute', left: 32, top: '50%', transform: 'translateY(-50%)', border: 'none' }}><ArrowLeft size={22}/></button>
            <button className="gallery-btn" onClick={() => setImgIdx((imgIdx + 1) % images.length)} style={{ position: 'absolute', right: 32, top: '50%', transform: 'translateY(-50%)', border: 'none' }}><ArrowRight size={22}/></button>
            <div style={{ position: 'absolute', bottom: 32, right: 40, display: 'flex', gap: 10 }}>
              {images.map((_, i) => (
                <button key={i} onClick={() => setImgIdx(i)} style={{ width: i === imgIdx ? 28 : 8, height: 8, borderRadius: 4, background: i === imgIdx ? 'var(--accent)' : 'rgba(255,255,255,0.4)', border: 'none', cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)', padding: 0 }}/>
              ))}
            </div>
          </>
        )}

        {/* Back link */}
        <Link to="/packages" style={{ position: 'absolute', top: 32, left: 32, display: 'inline-flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: 14, fontWeight: 600, background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', padding: '10px 20px', borderRadius: 40, border: '1px solid rgba(255,255,255,0.2)', transition: 'all 0.3s' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
          <ArrowLeft size={16}/> All Packages
        </Link>

        {/* Title overlay */}
        <div className="container" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 32px 52px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.4)', padding: '7px 18px', borderRadius: 40, color: 'var(--accent)', fontSize: 12, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20, backdropFilter: 'blur(10px)' }}>
            <Sparkles size={13}/> Premium Tour
          </div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 4.5vw, 3.8rem)', color: 'white', lineHeight: 1.05, fontWeight: 700, textShadow: '0 4px 24px rgba(0,0,0,0.4)', marginBottom: 20, maxWidth: 700 }}>
            {pkg.title}
            {pkg.nights && <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.65em', fontStyle: 'italic', display: 'block' }}>{pkg.duration} Days / {pkg.nights} Nights</span>}
          </h1>
          <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>Starting from</span>
              <span style={{ fontSize: 32, fontWeight: 700, color: 'var(--accent)', lineHeight: 1 }}>{formatPrice(pkg.price)}</span>
            </div>
            <span style={{ color: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 600, paddingBottom: 6 }}><MapPin size={17} color="var(--accent)"/>{pkg.location}</span>
            <span style={{ color: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 600, paddingBottom: 6 }}><Clock size={17} color="var(--accent)"/>{pkg.duration} Days</span>
            <span style={{ color: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 600, paddingBottom: 6 }}><Star size={15} color="var(--accent)" fill="var(--accent)"/>{pkg.averageRating || 0} ({pkg.totalReviews || 0} Reviews)</span>
          </div>

          <button 
            onClick={downloadPDF}
            style={{ 
              position: 'absolute', bottom: 52, right: 32, padding: '14px 28px', background: 'rgba(255,255,255,0.1)', 
              border: '1px solid rgba(255,255,255,0.2)', borderRadius: 12, color: 'white', fontWeight: 700, 
              display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', backdropFilter: 'blur(10px)' 
            }}
          >
            <Download size={18} /> Download Brochure
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="container" style={{ paddingTop: 56, paddingBottom: 80, padding: '56px 24px 80px' }}>
        <div className="detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 48, alignItems: 'start' }}>
          
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

            {/* About */}
            <div style={{ background: 'var(--bg-card)', borderRadius: 28, padding: '40px 44px', boxShadow: 'var(--shadow)', border: '1px solid var(--border-color)' }}>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: 'var(--text-main)', marginBottom: 20, fontWeight: 700 }}>About This Journey</h2>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.9, fontSize: 16 }}>{pkg.description}</p>
            </div>

            {/* Highlights */}
            {pkg.highlights?.length > 0 && (
              <div style={{ background: 'var(--bg-card)', borderRadius: 28, padding: '40px 44px', boxShadow: 'var(--shadow)', border: '1px solid var(--border-color)' }}>
                <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: 'var(--text-main)', marginBottom: 28, fontWeight: 700 }}>Trip Highlights</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
                  {pkg.highlights.map((h, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, background: 'var(--gray-100)', padding: '14px 18px', borderRadius: 16, border: '1px solid var(--border-color)' }}>
                      <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                        <CheckCircle size={14} color="var(--bg-card)" fill="var(--accent)"/>
                      </div>
                      <span style={{ fontSize: 14, color: 'var(--text-main)', fontWeight: 600, lineHeight: 1.4 }}>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Activities Accordion */}
            {pkg.includedActivities?.length > 0 && (
              <div style={{ background: 'var(--bg-card)', borderRadius: 28, overflow: 'hidden', boxShadow: 'var(--shadow)', border: '1px solid var(--border-color)' }}>
                <button
                  onClick={() => setShowActivities(!showActivities)}
                  style={{ width: '100%', background: 'none', border: 'none', padding: '30px 44px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', textAlign: 'left' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 52, height: 52, background: 'linear-gradient(135deg, #6366f1, #4f46e5)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, boxShadow: '0 6px 20px rgba(99,102,241,0.25)' }}>✨</div>
                    <div>
                      <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'var(--text-main)', fontWeight: 700, margin: 0 }}>Included Activities</h2>
                      <p style={{ color: '#a09387', fontSize: 13, marginTop: 2, fontWeight: 500 }}>Highlights and experiences included in your trip</p>
                    </div>
                  </div>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: showActivities ? 'var(--accent)' : 'var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}>
                    {showActivities ? <ChevronUp size={18} color="white"/> : <ChevronDown size={18} color="var(--text-muted)"/>}
                  </div>
                </button>

                {showActivities && (
                  <div style={{ padding: '0 44px 40px', display: 'flex', flexWrap: 'wrap', gap: 12, animation: 'fadeIn 0.3s ease' }}>
                    {pkg.includedActivities.map((act, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', background: 'var(--gray-100)', borderRadius: 16, border: '1px solid var(--border-color)', transition: 'all 0.25s' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }}/>
                        <span style={{ color: 'var(--text-main)', fontSize: 14, fontWeight: 700 }}>{act}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Travel Tips Accordion */}
            {pkg.travelTips && (pkg.travelTips.localCulture || pkg.travelTips.safetyTips || pkg.travelTips.weather || pkg.travelTips.clothingSuggestions) && (
              <div style={{ background: 'var(--bg-card)', borderRadius: 28, overflow: 'hidden', boxShadow: 'var(--shadow)', border: '1px solid var(--border-color)' }}>
                <button
                  onClick={() => setShowTips(!showTips)}
                  style={{ width: '100%', background: 'none', border: 'none', padding: '30px 44px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', textAlign: 'left' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 52, height: 52, background: 'linear-gradient(135deg, var(--accent), #e6be58)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, boxShadow: '0 6px 20px rgba(201,168,76,0.25)' }}>✈️</div>
                    <div>
                      <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'var(--text-main)', fontWeight: 700, margin: 0 }}>Travel Tips</h2>
                      <p style={{ color: '#a09387', fontSize: 13, marginTop: 2, fontWeight: 500 }}>Helpful guidance for a seamless journey</p>
                    </div>
                  </div>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: showTips ? 'var(--accent)' : 'var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}>
                    {showTips ? <ChevronUp size={18} color="white"/> : <ChevronDown size={18} color="var(--text-muted)"/>}
                  </div>
                </button>

                {showTips && (
                  <div style={{ padding: '0 44px 40px', display: 'flex', flexDirection: 'column', gap: 12, animation: 'fadeIn 0.3s ease' }}>
                    {[
                      { id: 0, key: 'localCulture',        icon: '🏛️', label: 'Local Culture',       color: '#fdf4ff', border: '#e9d5ff', iconBg: '#f3e8ff' },
                      { id: 1, key: 'safetyTips',          icon: '🛡️', label: 'Safety Tips',         color: '#f0fdf4', border: '#bbf7d0', iconBg: '#dcfce7' },
                      { id: 2, key: 'weather',             icon: '☀️', label: 'Weather',             color: '#fffbeb', border: '#fde68a', iconBg: '#fef3c7' },
                      { id: 3, key: 'clothingSuggestions', icon: '👗', label: 'Clothing Suggestions', color: '#fdf2f8', border: '#f9a8d4', iconBg: '#fce7f3' },
                    ].map(({ id, key, icon, label, color, border, iconBg }) =>
                      pkg.travelTips[key] ? (
                        <div key={key} style={{ background: 'var(--bg-card)', border: `1px solid ${expandedTip === id ? 'var(--accent)' : 'var(--border-color)'}`, borderRadius: 20, overflow: 'hidden', transition: 'all 0.3s', boxShadow: expandedTip === id ? 'var(--shadow-lg)' : 'none' }}>
                          <button
                            onClick={() => setExpandedTip(expandedTip === id ? -1 : id)}
                            style={{ width: '100%', background: 'transparent', border: 'none', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', textAlign: 'left', transition: 'background-color 0.2s' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,168,76,0.05)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                              <div style={{ width: 44, height: 44, background: iconBg, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{icon}</div>
                              <span style={{ fontWeight: 800, fontSize: 15, color: 'var(--text-main)', letterSpacing: 0.5 }}>{label}</span>
                            </div>
                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: expandedTip === id ? 'var(--accent)' : 'var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}>
                              {expandedTip === id ? <ChevronUp size={16} color="white"/> : <ChevronDown size={16} color="var(--gray-500)"/>}
                            </div>
                          </button>
                          {expandedTip === id && (
                            <div style={{ padding: '20px 24px 24px 84px', background: 'var(--bg-card)', animation: 'fadeIn 0.3s ease' }}>
                              <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.8, margin: 0, fontWeight: 500 }}>{pkg.travelTips[key]}</p>
                            </div>
                          )}
                        </div>
                      ) : null
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Itinerary Accordion */}
            {pkg.itinerary?.length > 0 && (
              <div style={{ background: 'var(--bg-card)', borderRadius: 28, overflow: 'hidden', boxShadow: 'var(--shadow)', border: '1px solid var(--border-color)' }}>
                <button
                  onClick={() => setShowItinerary(!showItinerary)}
                  style={{ width: '100%', background: 'none', border: 'none', padding: '30px 44px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', textAlign: 'left' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 52, height: 52, background: 'linear-gradient(135deg, var(--primary), #0a2540)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, boxShadow: '0 6px 20px rgba(13,37,53,0.15)' }}>🗺️</div>
                    <div>
                      <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'var(--text-main)', fontWeight: 700, margin: 0 }}>Day-by-Day Itinerary</h2>
                      <p style={{ color: '#a09387', fontSize: 13, marginTop: 2, fontWeight: 500 }}>Detailed plan for each day of your trip</p>
                    </div>
                  </div>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: showItinerary ? 'var(--accent)' : 'var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}>
                    {showItinerary ? <ChevronUp size={18} color="white"/> : <ChevronDown size={18} color="var(--text-muted)"/>}
                  </div>
                </button>

                {showItinerary && (
                  <div style={{ padding: '0 44px 40px', display: 'flex', flexDirection: 'column', gap: 16, animation: 'fadeIn 0.3s ease' }}>
                    {pkg.itinerary.map((day, idx) => (
                      <div key={idx} className="itin-item" style={{ border: expandedDay === idx ? '1px solid var(--accent)' : '1px solid var(--border-color)', boxShadow: expandedDay === idx ? 'var(--shadow-lg)' : 'none', background: 'var(--bg-card)' }}>
                        <button
                          onClick={() => setExpandedDay(expandedDay === idx ? -1 : idx)}
                          style={{ width: '100%', background: 'none', border: 'none', padding: '22px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', textAlign: 'left' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                            <div style={{ width: 50, height: 50, borderRadius: 16, background: expandedDay === idx ? 'linear-gradient(135deg, var(--accent), var(--accent-light))' : 'var(--gray-100)', color: expandedDay === idx ? 'var(--primary-navy)' : 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 15, transition: 'all 0.35s', flexShrink: 0 }}>
                              {String(day.day || idx + 1).padStart(2, '0')}
                            </div>
                            <div>
                              <div style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 800, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 4 }}>Day {day.day || idx + 1}</div>
                              <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', margin: 0, fontWeight: 700 }}>{day.title}</h3>
                            </div>
                          </div>
                          <div style={{ width: 36, height: 36, borderRadius: '50%', background: expandedDay === idx ? 'var(--accent)' : 'var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s', flexShrink: 0 }}>
                            {expandedDay === idx ? <ChevronUp size={18} color="white"/> : <ChevronDown size={18} color="var(--text-muted)"/>}
                          </div>
                        </button>

                        {expandedDay === idx && day.activities?.length > 0 && (
                          <div style={{ padding: '0 28px 28px 98px', animation: 'fadeIn 0.3s ease' }}>
                            <div style={{ borderLeft: '2px solid var(--border-color)', paddingLeft: 24 }}>
                              {day.activities.map((act, i) => (
                                <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 14, paddingBottom: 14, borderBottom: i < day.activities.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', marginTop: 8, flexShrink: 0 }}/>
                                  <span style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.7, fontWeight: 500 }}>{act}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Reviews Section */}
            <div style={{ background: 'var(--bg-card)', borderRadius: 28, padding: '40px 44px', boxShadow: 'var(--shadow)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                <div>
                  <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: 'var(--text-main)', fontWeight: 700, margin: 0 }}>Traveler Reviews</h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                    <div style={{ display: 'flex', gap: 2 }}>
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} size={14} fill={i <= Math.round(pkg.averageRating) ? 'var(--accent)' : 'none'} color="var(--accent)"/>
                      ))}
                    </div>
                    <span style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 600 }}>{pkg.averageRating} out of 5 ({pkg.totalReviews} reviews)</span>
                  </div>
                </div>
                {user && (
                  <button onClick={() => setShowReviewModal(true)} style={{ background: 'var(--accent)', color: 'var(--primary-navy)', border: 'none', borderRadius: 12, padding: '12px 24px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s' }}>
                    Write a Review
                  </button>
                )}
              </div>

              {reviews.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', background: 'var(--gray-50)', borderRadius: 20, border: '1px dashed var(--border-color)' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: 15, margin: 0 }}>No reviews yet. Be the first to share your experience!</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  {reviews.map(rev => (
                    <div key={rev._id} style={{ paddingBottom: 24, borderBottom: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--primary-navy)' }}>
                            {rev.user?.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-main)' }}>{rev.user?.name}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(rev.createdAt).toLocaleDateString()}</div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 2 }}>
                          {[1,2,3,4,5].map(i => (
                            <Star key={i} size={12} fill={i <= rev.rating ? 'var(--accent)' : 'none'} color="var(--accent)"/>
                          ))}
                        </div>
                      </div>
                      <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.7, margin: 0 }}>{rev.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Booking Sidebar */}
          <div>
            <div style={{ position: 'sticky', top: 100, display: 'flex', flexDirection: 'column', gap: 24 }}>
              
              {/* Interactive Map */}
              <div style={{ background: 'var(--bg-card)', borderRadius: 24, overflow: 'hidden', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow)' }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Globe size={18} color="var(--accent)" />
                  <span style={{ fontWeight: 700, fontSize: 15 }}>Interactive Location Guide</span>
                </div>
                <div style={{ height: 280, zIndex: 1 }}>
                  <MapContainer center={[pkg.coordinates?.lat || 28.6139, pkg.coordinates?.lng || 77.2090]} zoom={10} style={{ height: '100%', width: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={[pkg.coordinates?.lat || 28.6139, pkg.coordinates?.lng || 77.2090]}>
                      <Popup>{pkg.title}<br/>{pkg.location}</Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </div>

              <div style={{ background: 'var(--bg-card)', borderRadius: 28, padding: '40px 36px', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-color)' }}>
                {/* Price */}
                <div style={{ paddingBottom: 28, marginBottom: 32, borderBottom: '1px solid var(--border-color)', position: 'relative' }}>
                  {isSoldOut && (
                    <div style={{ position: 'absolute', top: -10, right: -10, background: 'var(--danger)', color: 'white', padding: '6px 14px', borderRadius: 10, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, boxShadow: '0 4px 12px rgba(220,38,38,0.2)' }}>Sold Out</div>
                  )}
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>Starting From</div>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '3rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1, opacity: isSoldOut ? 0.5 : 1 }}>{formatPrice(pkg.price)}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 8, fontWeight: 600, opacity: isSoldOut ? 0.5 : 1 }}>per adult &nbsp;·&nbsp; Child: {formatPrice(pkg.childPrice || Math.round(pkg.price * 0.5))}</div>
                </div>

              {/* Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginBottom: 36 }}>
                {[
                  [MapPin, 'Destination', [pkg.destinationCity, pkg.destinationState, pkg.destinationCountry].filter(Boolean).join(', ') || pkg.location],
                  [Clock,  'Duration', `${pkg.duration} Days${pkg.nights ? ` / ${pkg.nights} Nights` : ''}`],
                  [Navigation, 'Departs From', pkg.startingLocation || 'Multiple Cities'],
                  [Sun, 'Best Season', pkg.bestTimeToVisit || 'Year-round'],
                  [Users, 'Group Size', 'Flexible'],
                ].map(([Icon, label, val]) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                    <div style={{ width: 44, height: 44, background: 'var(--gray-100)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-color)', flexShrink: 0 }}>
                      <Icon size={20} color="var(--accent)"/>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 700, marginBottom: 4 }}>{label}</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.3 }}>{val}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Trust signals */}
              {(pkg.availableFoodOptions?.length > 0 || pkg.availableStayOptions?.length > 0) && (
                <div style={{ background: 'var(--gray-100)', padding: '16px 20px', borderRadius: 16, marginBottom: 28, border: '1px solid var(--border-color)' }}>
                  {pkg.availableFoodOptions?.length > 0 && (
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: pkg.availableStayOptions?.length > 0 ? 10 : 0 }}>
                      <span style={{ fontSize: 13 }}>🍽️</span>
                      <span style={{ fontSize: 13, color: 'var(--text-main)', fontWeight: 600 }}>{pkg.availableFoodOptions.join(' · ')}</span>
                    </div>
                  )}
                  {pkg.availableStayOptions?.length > 0 && (
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <span style={{ fontSize: 13 }}>🏨</span>
                      <span style={{ fontSize: 13, color: 'var(--text-main)', fontWeight: 600 }}>{pkg.availableStayOptions.join(' · ')}</span>
                    </div>
                  )}
                </div>
              )}

              {isSoldOut ? (
                <div style={{ textAlign: 'center' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 16, lineHeight: 1.5 }}>This package is currently fully booked. Join our waitlist to be notified of any openings.</p>
                  <button onClick={handleJoinWaitlist} disabled={waitLoading} style={{ width: '100%', padding: '20px', fontSize: 16, background: 'var(--primary-navy)', color: 'var(--accent)', border: '2px solid var(--accent)', borderRadius: 18, fontWeight: 800, cursor: 'pointer', transition: 'all 0.3s' }}>
                    {waitLoading ? 'Joining...' : 'Join Elite Waitlist'}
                  </button>
                </div>
              ) : (
                <button onClick={handleBook} style={{ width: '100%', padding: '20px', fontSize: 16, background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-light) 100%)', color: 'var(--primary-navy)', border: 'none', borderRadius: 18, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: 'pointer', transition: 'all 0.35s', boxShadow: 'var(--shadow-lg)', letterSpacing: 0.5 }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(201,168,76,0.3)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}>
                  Book This Journey <ArrowRight size={20}/>
                </button>
              )}

              {!user && (
                <div style={{ textAlign: 'center', marginTop: 16, padding: '10px 16px', background: '#fff7f7', borderRadius: 12, border: '1px solid #fecaca' }}>
                  <span style={{ fontSize: 13, color: '#dc2626', fontWeight: 600 }}>Please login to complete booking</span>
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', marginTop: 20 }}>
                <Shield size={16} color="var(--success)"/>
                <span style={{ fontSize: 13, color: 'var(--gray-500)', fontWeight: 600 }}>Secure & Safe Booking</span>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(5,15,30,0.85)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: 'var(--bg-card)', borderRadius: 32, width: '100%', maxWidth: 540, overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.4)', border: '1px solid var(--border-color)', animation: 'slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}>
            <div style={{ padding: '32px 40px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', margin: 0, fontWeight: 700, color: 'var(--text-main)' }}>Share Your Experience</h3>
              <button onClick={() => setShowReviewModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 8 }}><X size={24}/></button>
            </div>
            <div style={{ padding: '40px' }}>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target;
                const rating = reviewRating;
                const comment = form.comment.value;
                try {
                  const { data } = await api.post('/reviews', { packageId: id, rating, comment });
                  if (data.success) {
                    setShowReviewModal(false);
                    fetchReviews();
                    // Also refresh package stats
                    api.get(`/packages/${id}`).then(r => setPkg(r.data.package));
                  }
                } catch (err) {
                  alert(err.response?.data?.message || 'Failed to submit review');
                }
              }}>
                <div style={{ marginBottom: 32, textAlign: 'center' }}>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16 }}>Your Rating</div>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
                    {[1,2,3,4,5].map(num => (
                      <div 
                        key={num} 
                        style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                        onClick={() => setReviewRating(num)}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        <Star 
                          size={36} 
                          strokeWidth={1.5} 
                          fill={num <= reviewRating ? 'var(--accent)' : 'none'} 
                          color={num <= reviewRating ? 'var(--accent)' : 'var(--border-color)'}
                          style={{ transition: 'all 0.3s' }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: 32 }}>
                  <label style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1.5, display: 'block', marginBottom: 12 }}>Your Story</label>
                  <textarea name="comment" required placeholder="Tell others about your journey..." style={{ width: '100%', minHeight: 140, padding: '18px 22px', borderRadius: 20, background: 'var(--gray-50)', border: '1.5px solid var(--border-color)', color: 'var(--text-main)', fontSize: 15, fontFamily: 'inherit', outline: 'none', resize: 'none' }} />
                </div>

                <button type="submit" style={{ width: '100%', padding: '18px', background: 'var(--accent)', color: 'var(--primary-navy)', border: 'none', borderRadius: 16, fontWeight: 800, fontSize: 16, cursor: 'pointer', transition: 'all 0.3s' }}>
                  Submit Review
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
      <style>{`
        @keyframes slideUp { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
}
