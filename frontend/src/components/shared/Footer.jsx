import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--primary)', color: 'rgba(255,255,255,0.8)', padding: '60px 0 0' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 40, paddingBottom: 48 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, background: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Globe size={20} color="var(--primary)" />
              </div>
              <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 22, fontWeight: 600, color: 'white' }}>
                Vista<span style={{ color: 'var(--accent)' }}>Voyage</span>
              </span>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.7 }}>Crafting unforgettable journeys across India's most breathtaking destinations since 2020.</p>
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <div key={i} style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--accent)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
                  <Icon size={16} color="white" />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ color: 'var(--accent)', fontFamily: 'DM Sans', fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 20 }}>Quick Links</h4>
            {[['/', 'Home'], ['/packages', 'Explore Packages'], ['/about', 'About Us'], ['/contact', 'Contact Us']].map(([to, label]) => (
              <Link key={to} to={to} style={{ display: 'block', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', marginBottom: 10, fontSize: 14, transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}>{label}</Link>
            ))}
          </div>

          <div>
            <h4 style={{ color: 'var(--accent)', fontFamily: 'DM Sans', fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 20 }}>Contact Info</h4>
            {[
              [MapPin, 'VIT-AP university,Amaravati - 522237, Andhra Pradesh'],
              [Phone,  '+91 7448432423'],
              [Mail,   'hello@vistavoyage.in'],
            ].map(([Icon, text], i) => (
              <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 14, fontSize: 14 }}>
                <Icon size={16} color="var(--accent)" style={{ marginTop: 2, flexShrink: 0 }} />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: '20px 24px', textAlign: 'center', fontSize: 13 }}>
        <p>© {new Date().getFullYear()} VistaVoyage. All rights reserved. | Made with ❤️ for wanderers</p>
      </div>
    </footer>
  );
}
