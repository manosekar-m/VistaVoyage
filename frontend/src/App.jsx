import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CurrencyProvider } from './context/CurrencyContext';

// User Pages
import HomePage        from './pages/user/HomePage';
import LoginPage       from './pages/user/LoginPage';
import RegisterPage    from './pages/user/RegisterPage';
import PackagesPage    from './pages/user/PackagesPage';
import PackageDetail   from './pages/user/PackageDetail';
import BookingPage     from './pages/user/BookingPage';
import MyBookings      from './pages/user/MyBookings';
import WishlistPage    from './pages/user/WishlistPage';
import ProfilePage     from './pages/user/ProfilePage';
import FeedbackPage    from './pages/user/FeedbackPage';
import AboutPage       from './pages/user/AboutPage';
import ContactPage     from './pages/user/ContactPage';
import CancellationPolicy from './pages/user/CancellationPolicy';

// Admin Pages
import AdminLogin      from './pages/admin/AdminLogin';
import AdminDashboard  from './pages/admin/AdminDashboard';
import AdminBookings   from './pages/admin/AdminBookings';
import AdminPackages   from './pages/admin/AdminPackages';
import AdminUsers      from './pages/admin/AdminUsers';
import AdminFeedback   from './pages/admin/AdminFeedback';
import AdminProfile    from './pages/admin/AdminProfile';
import AdminRatings    from './pages/admin/AdminRatings';
import AdminPromos     from './pages/admin/AdminPromos';
import AdminQueries    from './pages/admin/AdminQueries';

// Shared Components
import Navbar          from './components/shared/Navbar';
import Footer          from './components/shared/Footer';
import ChatBot         from './components/shared/ChatBot';

const UserRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh'}}>Loading...</div>;
  return user ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { admin, loading } = useAuth();
  if (loading) return <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh'}}>Loading...</div>;
  return admin ? children : <Navigate to="/admin/login" replace />;
};

const UserLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
    <ChatBot />
    <Footer />
  </>
);

const AdminLayout = ({ children }) => (
  <>
    <div style={{padding: '20px', backgroundColor: '#333', color: 'white'}}>
      <div style={{maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <h2>VistaVoyage Admin Panel</h2>
        <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
          <a href="/admin" style={{color: 'white', textDecoration: 'none', marginRight: '1rem'}}>Dashboard</a>
          <button onClick={() => {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminData');
            window.location.href = '/admin/login';
          }} style={{padding: '8px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'}}>Logout</button>
        </div>
      </div>
    </div>
    {children}
  </>
);

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/"          element={<UserLayout><HomePage /></UserLayout>} />
      <Route path="/login"     element={<LoginPage />} />
      <Route path="/register"  element={<RegisterPage />} />
      <Route path="/packages"  element={<UserLayout><PackagesPage /></UserLayout>} />
      <Route path="/packages/:id" element={<UserLayout><PackageDetail /></UserLayout>} />
      <Route path="/about"     element={<UserLayout><AboutPage /></UserLayout>} />
      <Route path="/contact"   element={<UserLayout><ContactPage /></UserLayout>} />
      <Route path="/cancellation-policy" element={<UserLayout><CancellationPolicy /></UserLayout>} />

      {/* Protected user routes */}
      <Route path="/booking/:id"  element={<UserRoute><UserLayout><BookingPage /></UserLayout></UserRoute>} />
      <Route path="/my-bookings"  element={<UserRoute><UserLayout><MyBookings /></UserLayout></UserRoute>} />
      <Route path="/wishlist"     element={<UserRoute><UserLayout><WishlistPage /></UserLayout></UserRoute>} />
      <Route path="/profile"      element={<UserRoute><UserLayout><ProfilePage /></UserLayout></UserRoute>} />
      <Route path="/feedback"     element={<UserRoute><UserLayout><FeedbackPage /></UserLayout></UserRoute>} />

      {/* Admin routes */}
      <Route path="/admin/login"     element={<AdminLogin />} />
      <Route path="/admin"           element={<AdminRoute><AdminLayout><AdminDashboard /></AdminLayout></AdminRoute>} />
      <Route path="/admin/bookings"  element={<AdminRoute><AdminLayout><AdminBookings /></AdminLayout></AdminRoute>} />
      <Route path="/admin/packages"  element={<AdminRoute><AdminLayout><AdminPackages /></AdminLayout></AdminRoute>} />
      <Route path="/admin/users"     element={<AdminRoute><AdminLayout><AdminUsers /></AdminLayout></AdminRoute>} />
      <Route path="/admin/feedback"  element={<AdminRoute><AdminLayout><AdminFeedback /></AdminLayout></AdminRoute>} />
      <Route path="/admin/profile"   element={<AdminRoute><AdminLayout><AdminProfile /></AdminLayout></AdminRoute>} />
      <Route path="/admin/ratings"   element={<AdminRoute><AdminLayout><AdminRatings /></AdminLayout></AdminRoute>} />
      <Route path="/admin/promos"    element={<AdminRoute><AdminLayout><AdminPromos /></AdminLayout></AdminRoute>} />
      <Route path="/admin/queries"   element={<AdminRoute><AdminLayout><AdminQueries /></AdminLayout></AdminRoute>} />

      {/* 404 Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function AppContent() {
  return <AppRoutes />;
}

export default function App() {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </CurrencyProvider>
    </AuthProvider>
  );
}
