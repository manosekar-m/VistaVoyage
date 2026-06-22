import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { Heart } from 'lucide-react';

export default function PackagesPage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPackages();
    if (user) fetchWishlist();
  }, [user]);

  const fetchPackages = async () => {
    try {
      const res = await api.get('/packages');
      if (res.data.success) setPackages(res.data.packages);
    } catch (err) {
      console.error('Failed to fetch packages', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlist = async () => {
    try {
      const res = await api.get('/users/wishlist');
      if (res.data.success) {
        setWishlist(res.data.wishlist.map(pkg => pkg._id));
      }
    } catch (err) {
      console.error('Failed to fetch wishlist', err);
    }
  };

  const toggleWishlist = async (packageId) => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const res = await api.post(`/users/wishlist/${packageId}`);
      if (res.data.success) {
        setWishlist(res.data.wishlist);
      }
    } catch (err) {
      console.error('Failed to toggle wishlist', err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: '40px' }}>
      <h1>Travel Packages</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {packages.map((pkg) => (
          <div key={pkg._id} style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
            <button 
              onClick={() => toggleWishlist(pkg._id)}
              style={{
                position: 'absolute', top: '10px', right: '10px', background: 'white', border: 'none', 
                borderRadius: '50%', padding: '8px', cursor: 'pointer', zIndex: 1, display: 'flex'
              }}
            >
              <Heart color={wishlist.includes(pkg._id) ? 'red' : 'gray'} fill={wishlist.includes(pkg._id) ? 'red' : 'none'} size={20} />
            </button>
            <div style={{ height: '200px', backgroundColor: '#e0e0e0', backgroundImage: `url(${pkg.images && pkg.images.length > 0 ? `http://localhost:5000${pkg.images[0]}` : ''})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            </div>
            <div style={{ padding: '15px' }}>
              <h3>{pkg.title}</h3>
              <p>Duration: {pkg.duration?.days} days, {pkg.duration?.nights} nights</p>
              <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#007bff' }}>₹{pkg.price}</p>
              <Link to={`/packages/${pkg._id}`} style={{ display: 'block', padding: '10px', backgroundColor: '#007bff', color: 'white', textAlign: 'center', borderRadius: '5px', textDecoration: 'none', marginTop: '10px' }}>
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

