import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  LayoutDashboard, CalendarCheck, Package, Users,
  MessageSquare, HelpCircle, UserCircle, LogOut, Globe, Menu, X, ChevronRight, Tag,
  Moon, Sun, Sparkles
} from 'lucide-react';

const navItems = [
  { to: '/admin',           icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/bookings',  icon: CalendarCheck,   label: 'Bookings' },
  { to: '/admin/packages',  icon: Package,         label: 'Packages' },
  { to: '/admin/coupons',   icon: Tag,             label: 'Coupons' },
  { to: '/admin/users',     icon: Users,           label: 'Users' },
  { to: '/admin/feedback',  icon: MessageSquare,   label: 'Feedback' },
  { to: '/admin/queries',   icon: HelpCircle,      label: 'Queries' },
  { to: '/admin/profile',   icon: UserCircle,      label: 'Profile' },
  { to: '/admin/ai-plans',  icon: Sparkles,        label: 'AI Planner' },
];

export default function AdminLayout({ children }) {
  const { admin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--gray-50)' }}>
      {/* Sidebar */}
      <aside style={{
        width: collapsed ? 72 : 240, background: 'var(--primary)', transition: 'width 0.3s ease',
        display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 100,
        boxShadow: '4px 0 20px rgba(0,0,0,0.15)',
      }}>
        {/* Logo */}
        <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {!collapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 32, height: 32, background: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Globe size={18} color="var(--primary)"/>
              </div>
              <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 18, fontWeight: 600, color: 'white' }}>Vista<span style={{ color: 'var(--accent)' }}>Voyage</span></span>
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button 
              onClick={toggleTheme}
              style={{
                width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', 
                border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: 'white', transition: 'all 0.3s'
              }}>
              {theme === 'light' ? <Moon size={14} fill="white"/> : <Sun size={14} color="var(--accent)" fill="var(--accent)"/>}
            </button>
            <button onClick={() => setCollapsed(!collapsed)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', padding: 4 }}>
              {collapsed ? <Menu size={20}/> : <X size={20}/>}
            </button>
          </div>
        </div>

        {/* Admin info */}
        {!collapsed && (
          <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: 16 }}>{admin?.name?.charAt(0)}</span>
            </div>
            <div>
              <div style={{ color: 'white', fontWeight: 600, fontSize: 14 }}>{admin?.name}</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>Administrator</div>
            </div>
          </div>
        )}

        {/* Nav Links */}
        <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
          {navItems.map(({ to, icon: Icon, label }) => {
            const active = location.pathname === to;
            return (
              <Link key={to} to={to} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 20px', textDecoration: 'none',
                background: active ? 'rgba(201,168,76,0.2)' : 'transparent',
                borderLeft: active ? '3px solid var(--accent)' : '3px solid transparent',
                color: active ? 'var(--accent)' : 'rgba(255,255,255,0.7)',
                transition: 'all 0.2s', fontSize: 14, fontWeight: active ? 600 : 400,
              }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'white'; }}}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}}>
                <Icon size={18}/>
                {!collapsed && <span>{label}</span>}
                {!collapsed && active && <ChevronRight size={14} style={{ marginLeft: 'auto' }}/>}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <button onClick={handleLogout} style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px',
          background: 'none', border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)',
          color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 14, fontFamily: 'DM Sans',
          transition: 'color 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.color = '#ff6b6b'}
        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>
          <LogOut size={18}/>
          {!collapsed && 'Logout'}
        </button>
      </aside>

      {/* Main content */}
      <main style={{ marginLeft: collapsed ? 72 : 240, flex: 1, transition: 'margin-left 0.3s ease', minHeight: '100vh' }}>
        {children}
      </main>
    </div>
  );
}
