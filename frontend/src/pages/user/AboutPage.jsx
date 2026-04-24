import React from 'react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  const team = [
    { name: 'Manosekar M', role: 'Founder & CEO', emoji: '👨‍💼' },
    { name: 'Sai Charan',  role: 'Head of Operations', emoji: '👨‍💼' },
    { name: 'Sravanya',   role: 'Travel Curator', emoji: '👩‍🎨' },
  ];
  return (
    <div style={{ paddingTop: 72, minHeight: '100vh', background: 'var(--bg-page)', transition: 'all 0.3s ease' }}>
      <div style={{ background: 'linear-gradient(135deg, var(--primary), #0d2535)', padding: '80px 0', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200)', backgroundSize: 'cover', opacity: 0.1 }}/>
        <div className="container" style={{ position: 'relative', zIndex: 1, padding: '0 24px' }}>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2.8rem, 7vw, 4rem)', color: 'white', fontWeight: 700 }}>Our Story</h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 17, maxWidth: 560, margin: '16px auto 0', lineHeight: 1.7 }}>
            Born from a love of travel, VistaVoyage has been crafting unforgettable Indian journeys since 2020.
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '72px 16px' }}>
        <div className="about-story-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'start', marginBottom: 80 }}>
          <div>
            <span style={{ color: 'var(--accent)', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2 }}>Who We Are</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', color: 'var(--text-main)', marginTop: 8, marginBottom: 20, fontFamily: 'Cormorant Garamond, serif', fontWeight: 700 }}>Passionate About Every Journey</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: 16, marginBottom: 16 }}>
              We're a team of travel enthusiasts who believe that travel transforms lives. Since 2020, we've helped over 500 travelers explore the magnificent landscapes of India.
            </p>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: 16 }}>
              From the backwaters of Kerala to the deserts of Rajasthan, we curate experiences that go beyond typical tourism — creating genuine connections with places and cultures.
            </p>
            <Link to="/packages" className="btn btn-primary" style={{ marginTop: 28, display: 'inline-flex' }}>Explore Our Packages</Link>
          </div>
          <div style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #0a2540 100%)', borderRadius: 24, padding: 36, color: 'white', boxShadow: 'var(--shadow-lg)' }}>
            {[['500+', 'Happy Travelers'], ['50+', 'Destinations'], ['4.9★', 'Avg Rating'], ['8+', 'Years Experience']].map(([n, l]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '18px 0', borderBottom: '1px solid rgba(255,255,255,0.08)', alignItems: 'center' }}>
                <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.6rem, 4vw, 2rem)', color: 'var(--accent)', fontWeight: 600 }}>{n}</span>
                <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14, fontWeight: 500 }}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <span style={{ color: 'var(--accent)', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2 }}>Our People</span>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.2rem)', color: 'var(--text-main)', marginTop: 8, fontFamily: 'Cormorant Garamond, serif', fontWeight: 700 }}>Meet the Team</h2>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
          {team.map(t => (
            <div key={t.name} style={{ background: 'var(--bg-card)', borderRadius: 24, padding: '36px 28px', textAlign: 'center', flex: '1 1 200px', maxWidth: 260, boxShadow: 'var(--shadow)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>{t.emoji}</div>
              <h3 style={{ color: 'var(--text-main)', marginBottom: 6, fontWeight: 700 }}>{t.name}</h3>
              <p style={{ color: 'var(--accent)', fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>{t.role}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .about-story-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
      `}</style>
    </div>
  );
}
