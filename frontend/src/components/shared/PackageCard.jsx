import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Star, ArrowRight, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCurrency } from '../../context/CurrencyContext';
import api from '../../utils/api';

export default function PackageCard({ pkg, onWishlistUpdate }) {
  const { user, setUser } = useAuth();
  const { formatPrice } = useCurrency();
  const [loading, setLoading] = useState(false);
  
  const isWishlisted = user?.wishlist?.includes(pkg?._id) || false;

  const toggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return alert('Please login to add to wishlist');
    
    setLoading(true);
    try {
      const { data } = await api.post(`/users/wishlist/${pkg._id}`);
      if (data.success) {
        setUser({ ...user, wishlist: data.wishlist });
        if (onWishlistUpdate) onWishlistUpdate();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pkg-card" style={{ cursor: 'pointer', borderRadius: 24, overflow: 'hidden', background: 'var(--bg-card)', boxShadow: 'var(--shadow)', border: '1px solid var(--border-color)', transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)', position: 'relative' }}>
      <style>{`
        .pkg-card:hover { transform: translateY(-12px); box-shadow: var(--shadow-lg); }
        .pkg-img-container { position: relative; height: 280px; overflow: hidden; }
        .pkg-img { width: 100%; height: 100%; object-fit: cover; transition: transform 1.2s cubic-bezier(0.23, 1, 0.32, 1); }
        .pkg-card:hover .pkg-img { transform: scale(1.1); }
        .wishlist-btn { position: absolute; top: 20px; right: 20px; z-index: 10; width: 44px; height: 44px; border-radius: 50%; background: rgba(255,255,255,0.15); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.3); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s; color: white; padding: 0; }
        .wishlist-btn:hover { background: rgba(255,255,255,0.25); transform: scale(1.1); }
        .wishlist-btn.active { color: #ff4757; background: white; border-color: white; }
      `}</style>

      <div className="pkg-img-container">
        <img className="pkg-img" src={pkg.images?.[0] || 'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?w=800'} alt={pkg.title}/>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)' }}/>
        
        {/* Wishlist Heart */}
        <button 
          className={`wishlist-btn ${isWishlisted ? 'active' : ''}`} 
          onClick={toggleWishlist}
          disabled={loading}
          style={{ position: 'absolute', top: 20, right: 20 }}
        >
          <Heart size={20} fill={isWishlisted ? '#ff4757' : 'none'} strokeWidth={isWishlisted ? 0 : 2.5}/>
        </button>

        {/* Price Badge */}
        <div style={{ position: 'absolute', top: 20, left: 20, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.3)', padding: '8px 18px', borderRadius: 40, color: 'white', fontWeight: 800, fontSize: 16 }}>
          {formatPrice(pkg.price)}
        </div>

        {/* Bottom info */}
        <div style={{ position: 'absolute', bottom: 20, left: 24, right: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent)', fontSize: 12, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>
              <MapPin size={13}/> {pkg.location?.split(',')?.[0] || pkg.location || 'India'}
            </div>
            <div style={{ color: 'white', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.1 }}>
              {pkg.title}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.2)', padding: '6px 12px', borderRadius: 20, color: 'white', fontSize: 13, fontWeight: 700 }}>
            <Star size={13} fill="var(--accent)" color="var(--accent)"/> {pkg.averageRating || 0}
          </div>
        </div>
      </div>

      <div style={{ padding: '24px 24px 28px' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6, marginBottom: 20, height: 44, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {pkg.description}
        </p>

        <div style={{ display: 'flex', gap: 16, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 13, fontWeight: 600 }}>
            <Clock size={14} color="var(--accent)"/> {pkg.duration} Days
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 13, fontWeight: 600 }}>
            ✦ {pkg.includedActivities?.length || 0} Activities
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'Cormorant Garamond, serif' }}>
            {formatPrice(pkg.price)}
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginLeft: 4 }}>/adult</span>
          </div>
          <Link to={`/packages/${pkg._id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--accent)', fontWeight: 700, textDecoration: 'none', fontSize: 14 }}>
            Details <ArrowRight size={16}/>
          </Link>
        </div>
      </div>
    </div>
  );
}

