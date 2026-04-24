import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { CurrencyProvider } from './context/CurrencyContext';

// User Pages
import HomePage        from './pages/user/HomePage';
import LoginPage       from './pages/user/LoginPage';
import RegisterPage    from './pages/user/RegisterPage';
import PackagesPage    from './pages/user/PackagesPage';
import PackageDetail   from './pages/user/PackageDetail';
import BookingPage     from './pages/user/BookingPage';
import MyBookings      from './pages/user/MyBookings';
import ProfilePage     from './pages/user/ProfilePage';
import FeedbackPage    from './pages/user/FeedbackPage';
import AboutPage       from './pages/user/AboutPage';
import ContactPage     from './pages/user/ContactPage';
import WishlistPage    from './pages/user/WishlistPage';
import AIPlanner       from './pages/user/AIPlanner';

// Admin Pages
import AdminLogin      from './pages/admin/AdminLogin';
import AdminDashboard  from './pages/admin/AdminDashboard';
import AdminBookings   from './pages/admin/AdminBookings';
import AdminPackages   from './pages/admin/AdminPackages';
import AdminCoupons    from './pages/admin/AdminCoupons';
import AdminUsers      from './pages/admin/AdminUsers';
import AdminFeedback   from './pages/admin/AdminFeedback';
import AdminQueries    from './pages/admin/AdminQueries';
import AdminProfile    from './pages/admin/AdminProfile';
import AdminAIPlans    from './pages/admin/AdminAIPlans';

// Shared
import Navbar          from './components/shared/Navbar';
import Footer          from './components/shared/Footer';
import ChatBot         from './components/shared/ChatBot';

const UserRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh'}}><div className="spinner"/></div>;
  return user ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { admin, loading } = useAuth();
  if (loading) return <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh'}}><div className="spinner"/></div>;
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

const AppRoutes = () => {
  const { admin } = useAuth();
  return (
    <Routes>
      {/* Public user routes */}
      <Route path="/"          element={<UserLayout><HomePage /></UserLayout>} />
      <Route path="/login"     element={<LoginPage />} />
      <Route path="/register"  element={<RegisterPage />} />
      <Route path="/packages"  element={<UserLayout><PackagesPage /></UserLayout>} />
      <Route path="/packages/:id" element={<UserLayout><PackageDetail /></UserLayout>} />
      <Route path="/about"     element={<UserLayout><AboutPage /></UserLayout>} />
      <Route path="/contact"   element={<UserLayout><ContactPage /></UserLayout>} />

      {/* Protected user routes */}
      <Route path="/booking/:id"  element={<UserRoute><UserLayout><BookingPage /></UserLayout></UserRoute>} />
      <Route path="/my-bookings"  element={<UserRoute><UserLayout><MyBookings /></UserLayout></UserRoute>} />
      <Route path="/profile"      element={<UserRoute><UserLayout><ProfilePage /></UserLayout></UserRoute>} />
      <Route path="/feedback"     element={<UserRoute><UserLayout><FeedbackPage /></UserLayout></UserRoute>} />
      <Route path="/wishlist"     element={<UserRoute><UserLayout><WishlistPage /></UserLayout></UserRoute>} />
      <Route path="/ai-planner"   element={<UserRoute><UserLayout><AIPlanner /></UserLayout></UserRoute>} />

      {/* Admin routes */}
      <Route path="/admin/login"     element={<AdminLogin />} />
      <Route path="/admin"           element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/bookings"  element={<AdminRoute><AdminBookings /></AdminRoute>} />
      <Route path="/admin/packages"  element={<AdminRoute><AdminPackages /></AdminRoute>} />
      <Route path="/admin/coupons"   element={<AdminRoute><AdminCoupons /></AdminRoute>} />
      <Route path="/admin/users"     element={<AdminRoute><AdminUsers /></AdminRoute>} />
      <Route path="/admin/feedback"  element={<AdminRoute><AdminFeedback /></AdminRoute>} />
      <Route path="/admin/queries"   element={<AdminRoute><AdminQueries /></AdminRoute>} />
      <Route path="/admin/profile"   element={<AdminRoute><AdminProfile /></AdminRoute>} />
      <Route path="/admin/ai-plans"  element={<AdminRoute><AdminAIPlans /></AdminRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <CurrencyProvider>
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </CurrencyProvider>
    </ThemeProvider>
  );
}
