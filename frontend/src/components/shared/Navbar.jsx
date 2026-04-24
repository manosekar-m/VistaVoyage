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
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          
          <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
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
                width: 38, height: 38, borderRadius: '50%', 
                background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: 'white'
              }}
            >
              {theme === 'light' ? <Moon size={16} fill="white" /> : <Sun size={16} color="var(--accent)" fill="var(--accent)" />}
            </button>
          </div>

          {user ? (
            <div style={{ position: 'relative' }}>
              <button onClick={() => setDropOpen(!dropOpen)} style={{
                display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)', borderRadius: 40, padding: '6px 12px',
                color: 'white', cursor: 'pointer',
              }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {user.avatar ? (
                    <img src={user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ color: 'var(--primary)', fontWeight: 800, fontSize: 12 }}>{user.name?.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <span style={{ fontWeight: 600, fontSize: 13 }} className="desktop-nav">{user.name?.split(' ')[0]}</span>
              </button>
              {dropOpen && (
                <div style={{ position: 'absolute', right: 0, top: '110%', background: 'var(--bg-card)', borderRadius: 12, boxShadow: 'var(--shadow-lg)', minWidth: 200, overflow: 'hidden', zIndex: 1100, border: '1px solid var(--border-color)' }}>
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
                    width: '100%', fontFamily: 'DM Sans', fontSize: 14, textAlign: 'left'
                  }}>
                    <LogOut size={15}/> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Desktop login buttons */}
              <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <Link to="/login" style={{ color: 'rgba(255,255,255,0.88)', textDecoration: 'none', fontWeight: 500, fontSize: 14 }}>Login</Link>
                <Link to="/register" className="btn btn-accent btn-sm" style={{ padding: '8px 16px' }}>Sign Up</Link>
              </div>
              {/* Mobile login button - always visible in navbar */}
              <Link to="/login" className="mobile-login-btn" style={{ display: 'none', color: 'var(--accent)', textDecoration: 'none', fontWeight: 700, fontSize: 14, border: '1px solid var(--accent)', borderRadius: 20, padding: '6px 16px' }}>Login</Link>
            </>
          )}
          
          {/* Mobile Toggle */}
          <button onClick={() => setOpen(!open)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'none', padding: 8 }} className="mobile-menu-btn">
            {open ? <X size={26}/> : <Menu size={26}/>}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: open ? 0 : '-100%', width: '85%', height: '100vh',
        background: 'var(--primary)', zIndex: 2000, transition: '0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        padding: '80px 32px 40px', boxShadow: '-10px 0 30px rgba(0,0,0,0.3)',
        display: 'flex', flexDirection: 'column'
      }}>
        <button onClick={() => setOpen(false)} style={{ position: 'absolute', top: 24, right: 24, background: 'none', border: 'none', color: 'white' }}>
          <X size={30} />
        </button>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Login/Sign Up at top of drawer for unauthenticated users */}
          {!user && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 8 }}>
              <Link to="/login" onClick={() => setOpen(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '14px', borderRadius: 14, background: 'rgba(201,168,76,0.15)', border: '1px solid var(--accent)', color: 'var(--accent)', textDecoration: 'none', fontWeight: 700, fontSize: 16 }}>Login</Link>
              <Link to="/register" onClick={() => setOpen(false)} className="btn btn-accent" style={{ textAlign: 'center', padding: '14px', borderRadius: 14, fontSize: 16, fontWeight: 700 }}>Create Account</Link>
            </div>
          )}

          <div style={{ height: 1, background: 'rgba(255,255,255,0.1)' }} />

          {links.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} style={{ 
              color: location.pathname === l.to ? 'var(--accent)' : 'white', 
              textDecoration: 'none', fontSize: 24, fontWeight: 600, fontFamily: 'Cormorant Garamond, serif' 
            }}>{l.label}</Link>
          ))}
          
          <div style={{ height: 1, background: 'rgba(255,255,255,0.1)', margin: '8px 0' }} />
          
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={toggleTheme} style={{ flex: 1, padding: 12, borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              {theme === 'light' ? <><Moon size={18}/> Dark Mode</> : <><Sun size={18} color="var(--accent)"/> Light Mode</>}
            </button>
          </div>
        </div>

        <div style={{ marginTop: 'auto' }}>
          {user && (
            <button onClick={handleLogout} style={{ width: '100%', padding: 14, borderRadius: 12, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', fontWeight: 700 }}>
              Logout of Account
            </button>
          )}
        </div>
      </div>
      
      {/* Overlay */}
      {open && <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1999 }} />}

      <style>{`
        @media (max-width: 992px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
          .mobile-login-btn { display: flex !important; }
        }
      `}</style>

    </nav>
  );
}
