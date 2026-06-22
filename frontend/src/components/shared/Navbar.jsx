import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useTranslation } from 'react-i18next';
import '../../styles/Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { currency, changeCurrency } = useCurrency();
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
    localStorage.setItem('vv_lang', e.target.value);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">VistaVoyage</Link>
        <div className="navbar-menu">
          <Link to="/packages">{t('nav.packages') || 'Packages'}</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          {user ? (
            <>
              <Link to="/my-bookings">{t('nav.myBookings') || 'My Bookings'}</Link>
              <Link to="/wishlist">{t('nav.wishlist') || 'Wishlist'}</Link>
              <Link to="/profile">{t('nav.profile') || 'Profile'}</Link>
              <button onClick={logout} className="logout-btn">{t('nav.logout') || 'Logout'}</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn">{t('nav.login') || 'Login'}</Link>
              <Link to="/register" className="btn btn-primary">{t('nav.register') || 'Register'}</Link>
            </>
          )}
          
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginLeft: '10px' }}>
            <select 
              value={i18n.language} 
              onChange={handleLanguageChange}
              style={{ padding: '4px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: 'transparent', color: 'inherit', cursor: 'pointer' }}
            >
              <option value="en" style={{ color: 'black' }}>EN</option>
              <option value="hi" style={{ color: 'black' }}>HI</option>
              <option value="fr" style={{ color: 'black' }}>FR</option>
            </select>
            
            <select 
              value={currency} 
              onChange={(e) => changeCurrency(e.target.value)}
              style={{ padding: '4px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: 'transparent', color: 'inherit', cursor: 'pointer' }}
            >
              <option value="INR" style={{ color: 'black' }}>INR</option>
              <option value="USD" style={{ color: 'black' }}>USD</option>
              <option value="EUR" style={{ color: 'black' }}>EUR</option>
            </select>
          </div>
        </div>
      </div>
    </nav>
  );
}
