import React, { useEffect, useState } from 'react';
import { Heart, ArrowRight, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import PackageCard from '../../components/shared/PackageCard';
import { useAuth } from '../../context/AuthContext';

export default function WishlistPage() {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const { data } = await api.get('/users/wishlist');
      if (data.success) {
        setWishlist(data.wishlist);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <div style={{ paddingTop: 100, minHeight: '100vh', background: 'var(--bg-page)', paddingBottom: 80 }}>
      <div className="container" style={{ padding: '0 24px' }}>
        
        {/* Header */}
        <div style={{ marginBottom: 48, textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,71,87,0.1)', color: '#ff4757', padding: '8px 20px', borderRadius: 40, fontSize: 13, fontWeight: 800, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 16 }}>
            <Heart size={14} fill="#ff4757"/> My Wishlist
          </div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '3rem', color: 'var(--text-main)', fontWeight: 700, margin: 0 }}>
            Your Saved <span style={{ color: 'var(--accent)', fontStyle: 'italic' }}>Journeys</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 12, fontSize: 17, maxWidth: 600, margin: '12px auto 0' }}>
            Trips you've saved for your future adventures.
          </p>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
            <div className="spinner" style={{ width: 44, height: 44, borderWidth: 3 }}/>
          </div>
        ) : wishlist.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 40px', background: 'var(--bg-card)', borderRadius: 32, border: '1px solid var(--border-color)', maxWidth: 600, margin: '0 auto' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <Compass size={40} color="var(--text-muted)"/>
            </div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: 'var(--text-main)', marginBottom: 12 }}>Your wishlist is empty</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: 32, fontSize: 16 }}>Explore our handcrafted packages and save the ones you love!</p>
            <Link to="/packages" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'var(--accent)', color: 'var(--primary-navy)', padding: '14px 32px', borderRadius: 14, fontWeight: 800, textDecoration: 'none', transition: 'all 0.3s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
              Explore All Packages <ArrowRight size={18}/>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 32 }}>
            {wishlist.map(pkg => (
              <PackageCard key={pkg._id} pkg={pkg} onWishlistUpdate={fetchWishlist} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
