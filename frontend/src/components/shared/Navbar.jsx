import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">VistaVoyage</Link>
        <div className="navbar-menu">
          <Link to="/packages">Packages</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          {user ? (
            <>
              <Link to="/my-bookings">My Bookings</Link>
              <Link to="/wishlist">Wishlist</Link>
              <Link to="/profile">Profile</Link>
              <button onClick={logout} className="logout-btn">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn">Login</Link>
              <Link to="/register" className="btn btn-primary">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
