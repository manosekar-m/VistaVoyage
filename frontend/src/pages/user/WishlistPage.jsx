import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { Heart } from 'lucide-react';

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await api.get('/users/wishlist');
      if (res.data.success) {
        setWishlist(res.data.wishlist);
      }
    } catch (err) {
      console.error('Failed to fetch wishlist', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = async (packageId) => {
    try {
      const res = await api.post(`/users/wishlist/${packageId}`);
      if (res.data.success) {
        // Remove the package from local state if it was un-wishlisted
        if (!res.data.isWishlisted) {
          setWishlist(wishlist.filter(pkg => pkg._id !== packageId));
        }
      }
    } catch (err) {
      console.error('Failed to toggle wishlist', err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: '40px', minHeight: '60vh' }}>
      <h1>My Wishlist</h1>
      {wishlist.length === 0 ? (
        <p>Your wishlist is empty. <Link to="/packages">Browse packages</Link></p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {wishlist.map((pkg) => (
            <div key={pkg._id} style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
              <button 
                onClick={() => toggleWishlist(pkg._id)}
                style={{
                  position: 'absolute', top: '10px', right: '10px', background: 'white', border: 'none', 
                  borderRadius: '50%', padding: '8px', cursor: 'pointer', zIndex: 1, display: 'flex'
                }}
              >
                <Heart color="red" fill="red" size={20} />
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
      )}
    </div>
  );
}
