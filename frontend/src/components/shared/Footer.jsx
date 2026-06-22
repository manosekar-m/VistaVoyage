import React from 'react';
import '../../styles/Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h4>VistaVoyage</h4>
          <p>Your trusted travel companion for unforgettable journeys.</p>
        </div>
        <div className="footer-section">
          <h5>Quick Links</h5>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/packages">Packages</a></li>
            <li><a href="/about">About</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h5>Contact</h5>
          <p>Email: info@vistavoyage.com</p>
          <p>Phone: +1 234 567 8900</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 VistaVoyage. All rights reserved.</p>
      </div>
    </footer>
  );
}
