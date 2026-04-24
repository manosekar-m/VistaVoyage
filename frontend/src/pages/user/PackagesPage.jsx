import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Clock, X, SlidersHorizontal, Sparkles } from 'lucide-react';
import api from '../../utils/api';
import PackageCard from '../../components/shared/PackageCard';
import { useCurrency } from '../../context/CurrencyContext';

export default function PackagesPage() {
  const { formatPrice } = useCurrency();
  const [packages, setPackages] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filters,  setFilters]  = useState({ location: '', minPrice: '', maxPrice: '', duration: '', category: '', sortBy: 'newest' });
  const [applied,  setApplied]  = useState({});

  const fetchPackages = async (f = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (f.location)  params.append('location',  f.location);
      if (f.minPrice)  params.append('minPrice',  f.minPrice);
      if (f.maxPrice)  params.append('maxPrice',  f.maxPrice);
      if (f.duration)  params.append('duration',  f.duration);
      if (f.category)  params.append('category',  f.category);
      if (f.sortBy)    params.append('sortBy',    f.sortBy);
      const { data } = await api.get(`/packages?${params}`);
      setPackages(data.packages);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchPackages(); }, []);

  const applyFilters = () => { setApplied(filters); fetchPackages(filters); };
  const clearFilters = () => { const empty = { location:'', minPrice:'', maxPrice:'', duration:'', category: '', sortBy: 'newest' }; setFilters(empty); setApplied(empty); fetchPackages(empty); };
  const hasFilters   = Object.values(applied).some(Boolean);

  return (
    <div style={{ paddingTop: 72, minHeight: '100vh', background: 'var(--bg-page)', transition: 'all 0.3s ease' }}>
      <style>{`
        .filter-input { border: none; outline: none; font-size: 15px; width: 100%; color: var(--text-main); background: transparent; font-weight: 500; }
        .filter-input::placeholder { color: var(--text-muted); font-weight: 400; }
      `}</style>

      {/* Hero */}
      <div style={{ position: 'relative', height: 480, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'url(https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1800) center/cover no-repeat' }}/>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(5,15,25,0.4) 0%, rgba(5,15,25,0.85) 100%)' }}/>
        <div className="container" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1, textAlign: 'center', padding: '0 24px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(201,168,76,0.2)', border: '1px solid rgba(201,168,76,0.4)', padding: '8px 20px', borderRadius: 40, color: 'var(--accent)', fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 24, backdropFilter: 'blur(10px)' }}>
            <Sparkles size={14}/> Handcrafted Experiences
          </div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2.5rem, 6vw, 4.2rem)', color: 'white', lineHeight: 1.1, fontWeight: 700, marginBottom: 20 }}>
            Where Will Your Next<br/><span style={{ color: 'var(--accent)', fontStyle: 'italic' }}>Story Begin?</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 18, fontWeight: 400, maxWidth: 540, lineHeight: 1.7 }}>
            {packages.length}+ curated journeys across breathtaking destinations.
          </p>
        </div>
      </div>

      {/* Floating Search Bar */}
      <div className="container" style={{ marginTop: -44, position: 'relative', zIndex: 20, padding: '0 24px' }}>
        <div style={{ background: 'var(--bg-card)', borderRadius: 28, padding: '16px 32px', boxShadow: 'var(--shadow-lg)', display: 'flex', gap: 0, alignItems: 'center', border: '1px solid var(--border-color)', backdropFilter: 'blur(20px)' }}>
          <div style={{ flex: '2 1 200px', borderRight: '1px solid var(--border-color)', paddingRight: 24, marginRight: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 4 }}>Where</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <MapPin size={18} color="var(--accent)" strokeWidth={2.5}/>
              <input className="filter-input" placeholder="Destination, city..." value={filters.location} onChange={e => setFilters({...filters, location: e.target.value})} onKeyDown={e => e.key === 'Enter' && applyFilters()}/>
            </div>
          </div>
          <div style={{ flex: '1 1 140px', borderRight: '1px solid var(--border-color)', paddingRight: 24, marginRight: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 4 }}>Budget (Max)</div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>₹</span>
              <input className="filter-input" type="number" placeholder="Max ₹" value={filters.maxPrice} onChange={e => setFilters({...filters, maxPrice: e.target.value})}/>
            </div>
          </div>
          <div style={{ flex: '1 1 100px', paddingRight: 24, marginRight: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 4 }}>Duration</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Clock size={16} color="var(--accent)" strokeWidth={2.5}/>
              <input className="filter-input" type="number" placeholder="Days" value={filters.duration} onChange={e => setFilters({...filters, duration: e.target.value})}/>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, flexShrink: 0 }}>
            {hasFilters && (
              <button onClick={clearFilters} style={{ width: 52, height: 52, background: '#fee2e2', border: 'none', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s', color: '#ef4444' }}>
                <X size={18}/>
              </button>
            )}
            <button onClick={applyFilters} style={{ height: 52, padding: '0 28px', background: 'linear-gradient(135deg, var(--accent), var(--accent-light))', color: 'var(--primary-navy)', border: 'none', borderRadius: 26, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, fontWeight: 800, fontSize: 15, transition: 'all 0.3s', boxShadow: 'var(--shadow)' }}>
              <Search size={18} strokeWidth={2.5}/> Search
            </button>
          </div>
        </div>
      </div>

      {/* Categories & Sorting */}
      <div className="container" style={{ paddingTop: 64, padding: '64px 24px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 24 }}>
          <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8, msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
            {['Adventure', 'Romantic', 'Family', 'Pilgrimage', 'Luxury', 'Budget'].map(cat => (
              <button
                key={cat}
                onClick={() => {
                  const newCat = filters.category === cat ? '' : cat;
                  setFilters({ ...filters, category: newCat });
                  fetchPackages({ ...filters, category: newCat });
                }}
                style={{
                  padding: '10px 24px',
                  borderRadius: 30,
                  border: filters.category === cat ? '1px solid var(--accent)' : '1px solid var(--border-color)',
                  background: filters.category === cat ? 'var(--accent)' : 'transparent',
                  color: filters.category === cat ? 'var(--primary-navy)' : 'var(--text-muted)',
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.3s'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 600 }}>Sort by:</span>
            <select
              value={filters.sortBy}
              onChange={(e) => {
                setFilters({ ...filters, sortBy: e.target.value });
                fetchPackages({ ...filters, sortBy: e.target.value });
              }}
              style={{
                padding: '10px 20px',
                borderRadius: 12,
                border: '1px solid var(--border-color)',
                background: 'var(--bg-card)',
                color: 'var(--text-main)',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="newest">Newest First</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container" style={{ paddingBottom: 100, padding: '48px 24px 100px' }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 0', gap: 20 }}>
            <div className="spinner" style={{ width: 40, height: 40, borderWidth: 3 }}/>
            <p style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Discovering amazing packages...</p>
          </div>
        ) : packages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>🌍</div>
            <h3 style={{ color: 'var(--text-main)', fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', marginBottom: 12 }}>No packages found</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: 28, fontSize: 16 }}>Try different search criteria</p>
            <button onClick={clearFilters} style={{ padding: '14px 32px', background: 'var(--accent)', border: 'none', borderRadius: 12, fontWeight: 700, cursor: 'pointer' }}>Clear All Filters</button>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 40 }}>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.4rem', color: 'var(--text-main)', fontWeight: 700, margin: 0 }}>
                {filters.category ? `${filters.category} Packages` : hasFilters ? 'Search Results' : 'Explore All Packages'}
              </h2>
              <p style={{ color: 'var(--text-muted)', marginTop: 8, fontSize: 16, fontWeight: 500 }}>{packages.length} curated experiences available for you</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 32 }}>
              {packages.map(pkg => (
                <PackageCard key={pkg._id} pkg={pkg} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
