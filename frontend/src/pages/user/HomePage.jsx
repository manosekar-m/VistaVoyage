import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ChevronDown } from 'lucide-react';
import api from '../../utils/api';
import PackageCard from '../../components/shared/PackageCard';

export default function HomePage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    api.get('/packages?status=Active').then(r => setPackages(r.data.packages.slice(0, 6))).finally(() => setLoading(false));
  }, []);

  const scrollDown = () => document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' });

  const stats = [
    { num: '500+', label: 'Happy Travelers' },
    { num: '50+',  label: 'Destinations' },
    { num: '4.9',  label: 'Average Rating', icon: <Star size={14} fill="var(--accent)" color="var(--accent)"/> },
    { num: '8+',   label: 'Years Experience' },
  ];

  return (
    <div>
      {/* Hero */}
      <section style={{ minHeight: '100vh', background: 'linear-gradient(135deg, var(--primary) 0%, #0a2540 60%, #051525 100%)', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.18 }}/>
        <div style={{ position: 'absolute', bottom: 60, left: '50%', transform: 'translateX(-50%)', zIndex: 5 }}>
          <button onClick={scrollDown} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', animation: 'bounce2 2s infinite' }}>
            <ChevronDown size={32}/>
          </button>
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 1, paddingTop: 80, paddingBottom: 80, textAlign: 'center' }}>
          <div style={{ display: 'inline-block', background: 'rgba(201,168,76,0.2)', border: '1px solid rgba(201,168,76,0.4)', borderRadius: 40, padding: '8px 20px', marginBottom: 24, animation: 'fadeIn 0.6s ease' }}>
            <span style={{ color: 'var(--accent)', fontSize: 14, fontWeight: 500 }}>✈️ Discover India's Hidden Treasures</span>
          </div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2.8rem, 6vw, 5rem)', color: 'white', lineHeight: 1.1, marginBottom: 24, animation: 'fadeIn 0.6s 0.1s ease both' }}>
            Journey Beyond<br/><span style={{ color: 'var(--accent)', fontStyle: 'italic' }}>The Horizon</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 'clamp(15px, 2vw, 19px)', maxWidth: 600, margin: '0 auto 40px', lineHeight: 1.7, animation: 'fadeIn 0.6s 0.2s ease both', padding: '0 16px' }}>
            Handcrafted travel experiences across India's most breathtaking destinations. From snow-capped peaks to sun-kissed shores.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', animation: 'fadeIn 0.6s 0.3s ease both', padding: '0 16px' }}>
            <Link to="/packages" className="btn btn-accent" style={{ fontSize: 16, padding: '14px 32px' }}>Explore Packages <ArrowRight size={18}/></Link>
            <Link to="/about" className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', fontSize: 16, padding: '14px 32px' }}>Learn More</Link>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 16, marginTop: 72, maxWidth: 800, margin: '72px auto 0', animation: 'fadeIn 0.6s 0.4s ease both', padding: '0 16px' }}>
            {stats.map(s => (
              <div key={s.label} style={{ textAlign: 'center', padding: '12px 8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                  {s.icon}
                  <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.5rem, 4vw, 2rem)', color: 'var(--accent)', fontWeight: 600 }}>{s.num}</span>
                </div>
                <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12, marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Packages */}
      <section id="featured" style={{ padding: '64px 0', background: 'var(--bg-page)' }}>
        <div className="container" style={{ padding: '0 16px' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={{ color: 'var(--accent)', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2 }}>Handpicked For You</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.6rem)', color: 'var(--text-main)', marginTop: 8, fontFamily: 'Cormorant Garamond, serif', fontWeight: 700 }}>Featured Packages</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: 12, maxWidth: 500, margin: '12px auto 0', fontSize: 'clamp(14px, 2vw, 16px)', lineHeight: 1.6 }}>Curated journeys designed to create memories that last a lifetime.</p>
          </div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 60 }}><div className="spinner"/></div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: 24 }}>
              {packages.map(pkg => <PackageCard key={pkg._id} pkg={pkg}/>)}
            </div>
          )}
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <Link to="/packages" className="btn btn-outline" style={{ fontSize: 15, width: 'auto', padding: '14px 32px' }}>View All Packages <ArrowRight size={16}/></Link>
          </div>
        </div>
      </section>

      {/* Why us */}
      <section style={{ background: 'var(--primary)', padding: '64px 0' }}>
        <div className="container" style={{ padding: '0 16px' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.4rem)', color: 'white', fontFamily: 'Cormorant Garamond, serif', fontWeight: 700 }}>Why Choose VistaVoyage?</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: 10, fontSize: 15 }}>What makes our journeys truly unforgettable.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: 24 }}>
            {[
              { icon: '🛡️', title: 'Safe & Secure',     desc: 'Fully verified packages with 24/7 traveler support.' },
              { icon: '💰', title: 'Best Price',         desc: 'Competitive pricing with no hidden costs.' },
              { icon: '🗺️', title: 'Expert Guides',     desc: 'Local expert guides who know every hidden gem.' },
              { icon: '✨', title: 'Premium Experience', desc: 'Handpicked stays for an unforgettable adventure.' },
            ].map(item => (
              <div key={item.title} style={{ textAlign: 'center', padding: '28px 20px', background: 'rgba(255,255,255,0.04)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>{item.icon}</div>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', color: 'var(--accent)', marginBottom: 10 }}>{item.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 16px', background: 'var(--bg-page)', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.6rem)', color: 'var(--text-main)', marginBottom: 16, fontFamily: 'Cormorant Garamond, serif', fontWeight: 700 }}>Ready For Your Next Adventure?</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 'clamp(15px, 2vw, 17px)', maxWidth: 480, margin: '0 auto 36px', lineHeight: 1.6 }}>Book your dream trip today and explore the beauty of India.</p>
          <Link to="/packages" className="btn btn-primary" style={{ fontSize: 16, padding: '16px 40px', width: 'auto', display: 'inline-flex', alignItems: 'center', gap: 10 }}>Start Exploring <ArrowRight size={18}/></Link>
        </div>
      </section>

      <style>{`
        @keyframes bounce2 { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(8px)} }
      `}</style>
    </div>
  );
}
