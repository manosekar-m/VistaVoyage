import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useCurrency } from '../../context/CurrencyContext';
import { Menu, X, Globe, User, LogOut, Briefcase, MessageSquare, Moon, Sun, Heart, Sparkles, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { currency, setCurrency } = useCurrency();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [currOpen, setCurrOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isHome = location.pathname === '/';
  const navStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
    padding: '0 24px',
    background: scrolled || !isHome ? 'rgba(26,58,74,0.97)' : 'transparent',
    backdropFilter: scrolled ? 'blur(10px)' : 'none',
    transition: 'all 0.3s ease',
    borderBottom: scrolled ? '1px solid rgba(201,168,76,0.2)' : 'none',
  };

  const handleLogout = () => { logout(); navigate('/'); setDropOpen(false); };
  const links = [
    { to: '/', label: 'Home' },
    { to: '/packages', label: 'Packages' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <nav style={navStyle}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, background: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Globe size={20} color="var(--primary)" />
          </div>
          <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 24, fontWeight: 600, color: 'white', letterSpacing: 1 }}>
            Vista<span style={{ color: 'var(--accent)' }}>Voyage</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="desktop-nav">
          {links.map(l => (
            <Link key={l.to} to={l.to} style={{
              color: location.pathname === l.to ? 'var(--accent)' : 'rgba(255,255,255,0.88)',
              textDecoration: 'none', fontWeight: 500, fontSize: 15,
              transition: 'color 0.2s', borderBottom: location.pathname === l.to ? '2px solid var(--accent)' : '2px solid transparent',
              paddingBottom: 2,
            }}>{l.label}</Link>
          ))}
        </div>

        {/* Auth & Theme Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, position: 'relative' }}>
          
          {/* Currency Switcher */}
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setCurrOpen(!currOpen)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)', borderRadius: 30, padding: '8px 14px',
                color: 'white', cursor: 'pointer', fontFamily: 'DM Sans', fontSize: 13, fontWeight: 700
              }}
            >
              <Globe size={14} /> {currency} <ChevronDown size={12} style={{ transform: currOpen ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
            </button>
            {currOpen && (
              <div style={{ position: 'absolute', top: '120%', right: 0, background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border-color)', boxShadow: 'var(--shadow)', padding: '8px', zIndex: 1000, minWidth: 100 }}>
                {['INR', 'USD', 'EUR'].map(c => (
                  <button 
                    key={c}
                    onClick={() => { setCurrency(c); setCurrOpen(false); }}
                    style={{ 
                      width: '100%', padding: '10px', textAlign: 'left', background: currency === c ? 'var(--sand)' : 'transparent',
                      border: 'none', borderRadius: 8, color: 'var(--text-main)', cursor: 'pointer', fontSize: 13, fontWeight: 600
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            style={{
              width: 40, height: 40, borderRadius: '50%', 
              background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'white', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: theme === 'dark' ? '0 0 15px rgba(201,168,76,0.3)' : 'none'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; e.currentTarget.style.transform = 'rotate(12deg) scale(1.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'rotate(0) scale(1)'; }}
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? <Moon size={18} fill="white" /> : <Sun size={18} color="var(--accent)" fill="var(--accent)" />}
          </button>

          {user ? (
            <div style={{ position: 'relative' }}>
              <button onClick={() => setDropOpen(!dropOpen)} style={{
                display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)', borderRadius: 40, padding: '8px 16px',
                color: 'white', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: 14,
              }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {user.avatar ? (
                    <img src={user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ color: 'var(--primary)', fontWeight: 800, fontSize: 13 }}>{user.name?.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <span style={{ fontWeight: 600 }}>{user.name?.split(' ')[0]}</span>
              </button>
              {dropOpen && (
                <div style={{ position: 'absolute', right: 0, top: '110%', background: 'var(--bg-card)', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.15)', minWidth: 200, overflow: 'hidden', zIndex: 100, border: '1px solid var(--border-color)' }}>
                  {[
                    { to: '/profile',      icon: <User size={15}/>,         label: 'My Profile' },
                    { to: '/wishlist',     icon: <Heart size={15}/>,        label: 'Wishlist' },
                    { to: '/ai-planner',   icon: <Sparkles size={15} color="var(--accent)"/>, label: 'AI Trip Planner' },
                    { to: '/my-bookings',  icon: <Briefcase size={15}/>,    label: 'My Bookings' },
                    { to: '/feedback',     icon: <MessageSquare size={15}/>, label: 'Feedback' },
                  ].map(item => (
                    <Link key={item.to} to={item.to} onClick={() => setDropOpen(false)} style={{
                      display: 'flex', alignItems: 'center', gap: 10, padding: '12px 20px',
                      color: 'var(--text-main)', textDecoration: 'none', fontSize: 14,
                      borderBottom: '1px solid var(--border-color)',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--sand)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      {item.icon} {item.label}
                    </Link>
                  ))}
                  <button onClick={handleLogout} style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '12px 20px',
                    color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer',
                    width: '100%', fontFamily: 'DM Sans', fontSize: 14,
                  }}>
                    <LogOut size={15}/> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" style={{ color: 'rgba(255,255,255,0.88)', textDecoration: 'none', fontWeight: 500, fontSize: 15 }}>Login</Link>
              <Link to="/register" className="btn btn-accent btn-sm">Sign Up</Link>
            </>
          )}
          <button onClick={() => setOpen(!open)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'none' }} className="mobile-menu-btn">
            {open ? <X size={24}/> : <Menu size={24}/>}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div style={{ background: 'rgba(26,58,74,0.98)', padding: '16px 24px 24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          {links.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} style={{ display: 'block', color: 'white', textDecoration: 'none', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: 16 }}>{l.label}</Link>
          ))}
          {user ? (
            <>
              <Link to="/my-bookings" onClick={() => setOpen(false)} style={{ display: 'block', color: 'white', textDecoration: 'none', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>My Bookings</Link>
              <button onClick={handleLogout} style={{ marginTop: 12, background: 'var(--danger)', color: 'white', border: 'none', borderRadius: 8, padding: '10px 20px', cursor: 'pointer', fontFamily: 'DM Sans' }}>Logout</button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              <Link to="/login"    onClick={() => setOpen(false)} className="btn btn-outline" style={{ color: 'white', borderColor: 'white' }}>Login</Link>
              <Link to="/register" onClick={() => setOpen(false)} className="btn btn-accent">Sign Up</Link>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
