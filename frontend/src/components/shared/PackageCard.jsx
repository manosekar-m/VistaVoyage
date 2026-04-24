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
    <div className="pkg-card">
      <div className="pkg-img-container">
        <img className="pkg-img" src={pkg.images?.[0] || 'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?w=800'} alt={pkg.title}/>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)' }}/>
        
        {/* Wishlist Heart */}
        <button 
          className={`wishlist-btn ${isWishlisted ? 'active' : ''}`} 
          onClick={toggleWishlist}
          disabled={loading}
        >
          <Heart size={20} fill={isWishlisted ? '#ff4757' : 'none'} strokeWidth={isWishlisted ? 0 : 2.5}/>
        </button>

        {/* Price Badge */}
        <div style={{ position: 'absolute', top: '16px', left: '16px', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.3)', padding: '6px 14px', borderRadius: 40, color: 'white', fontWeight: 800, fontSize: 15 }}>
          {formatPrice(pkg.price)}
        </div>

        {/* Bottom info */}
        <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent)', fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              <MapPin size={12}/> {pkg.location?.split(',')?.[0] || pkg.location || 'India'}
            </div>
            <div style={{ color: 'white', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', fontWeight: 700, lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {pkg.title}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: 20, color: 'white', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
            <Star size={12} fill="var(--accent)" color="var(--accent)"/> {pkg.averageRating || 0}
          </div>
        </div>
      </div>

      <div className="pkg-card-body">
        <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6, marginBottom: 16, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {pkg.description}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, paddingBottom: 16, borderBottom: '1px solid var(--border-color)', marginBottom: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)', fontSize: 13, fontWeight: 600 }}>
            <Clock size={14} color="var(--accent)"/> {pkg.duration} Days
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)', fontSize: 13, fontWeight: 600 }}>
            ✦ {pkg.includedActivities?.length || 0} Activities
          </div>
        </div>

        <div className="pkg-card-price-row">
          <div className="pkg-card-price">
            {formatPrice(pkg.price)}
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginLeft: 4, fontFamily: 'DM Sans, sans-serif' }}>/adult</span>
          </div>
          <Link to={`/packages/${pkg._id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--accent)', fontWeight: 700, textDecoration: 'none', fontSize: 14, flexShrink: 0 }}>
            Details <ArrowRight size={16}/>
          </Link>
        </div>
      </div>
    </div>
  );
}

