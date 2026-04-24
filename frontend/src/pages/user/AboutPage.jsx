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
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '3.5rem', color: 'white' }}>Our Story</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 18, maxWidth: 600, margin: '16px auto 0', lineHeight: 1.7 }}>
            Born from a love of travel, VistaVoyage has been crafting unforgettable Indian journeys since 2020.
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '72px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center', marginBottom: 80 }}>
          <div>
            <span style={{ color: 'var(--accent)', fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 2 }}>Who We Are</span>
            <h2 style={{ fontSize: '2.4rem', color: 'var(--text-main)', marginTop: 8, marginBottom: 20 }}>Passionate About Every Journey</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: 16, marginBottom: 16 }}>
              We're a team of travel enthusiasts who believe that travel transforms lives. Since 2020, we've helped over 500 travelers explore the magnificent landscapes of India.
            </p>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: 16 }}>
              From the backwaters of Kerala to the deserts of Rajasthan, we curate experiences that go beyond typical tourism — creating genuine connections with places and cultures.
            </p>
            <Link to="/packages" className="btn btn-primary" style={{ marginTop: 28 }}>Explore Our Packages</Link>
          </div>
          <div style={{ background: 'var(--primary)', borderRadius: 24, padding: 40, color: 'white' }}>
            {[['500+', 'Happy Travelers'], ['50+', 'Destinations'], ['4.9★', 'Avg Rating'], ['8+', 'Years Experience']].map(([n, l]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', alignItems: 'center' }}>
                <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: 'var(--accent)' }}>{n}</span>
                <span style={{ color: 'rgba(255,255,255,0.7)' }}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{ fontSize: '2rem', color: 'var(--text-main)' }}>Meet the Team</h2>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap' }}>
          {team.map(t => (
            <div key={t.name} style={{ background: 'var(--bg-card)', borderRadius: 20, padding: 32, textAlign: 'center', minWidth: 200, boxShadow: 'var(--shadow)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: 52, marginBottom: 12 }}>{t.emoji}</div>
              <h3 style={{ color: 'var(--text-main)', marginBottom: 4 }}>{t.name}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{t.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
