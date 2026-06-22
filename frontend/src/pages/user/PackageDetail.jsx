import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const StarRating = ({ rating, interactive = false, onRate }) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display: 'inline-flex', gap: '4px' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{
            fontSize: '20px',
            color: star <= (hovered || rating) ? '#f5a623' : '#ddd',
            cursor: interactive ? 'pointer' : 'default',
            transition: 'color 0.15s',
          }}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          onClick={() => interactive && onRate && onRate(star)}
        >★</span>
      ))}
    </div>
  );
};

export default function PackageDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    Promise.all([fetchPackage(), fetchReviews()]).finally(() => setLoading(false));
  }, [id]);

  const fetchPackage = async () => {
    try {
      const res = await api.get(`/packages/${id}`);
      if (res.data.success) setPkg(res.data.package);
    } catch (err) {
      console.error('Failed to fetch package', err);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await api.get(`/reviews/package/${id}`);
      if (res.data.success) setReviews(res.data.reviews);
    } catch (err) {
      console.error('Failed to fetch reviews', err);
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <div style={{ fontSize: '18px', color: '#666' }}>Loading package details...</div>
    </div>
  );

  if (!pkg) return (
    <div style={{ textAlign: 'center', padding: '80px', color: '#666' }}>Package not found.</div>
  );

  const imageUrl = (img) => img ? `http://localhost:5000${img}` : 'https://via.placeholder.com/800x400?text=No+Image';

  const tabStyle = (tab) => ({
    padding: '12px 24px',
    border: 'none',
    borderBottom: activeTab === tab ? '3px solid #007bff' : '3px solid transparent',
    backgroundColor: 'transparent',
    color: activeTab === tab ? '#007bff' : '#666',
    fontWeight: activeTab === tab ? '700' : '400',
    cursor: 'pointer',
    fontSize: '15px',
    transition: 'all 0.2s',
  });

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '30px 20px', fontFamily: 'Inter, sans-serif' }}>

      {/* Hero Images */}
      <div style={{ borderRadius: '16px', overflow: 'hidden', marginBottom: '30px', position: 'relative' }}>
        <img
          src={pkg.images && pkg.images.length > 0 ? imageUrl(pkg.images[activeImage]) : imageUrl()}
          alt={pkg.title}
          style={{ width: '100%', height: '450px', objectFit: 'cover' }}
        />
        {pkg.images && pkg.images.length > 1 && (
          <div style={{ display: 'flex', gap: '8px', padding: '10px', overflowX: 'auto', backgroundColor: 'rgba(0,0,0,0.04)' }}>
            {pkg.images.map((img, i) => (
              <img
                key={i}
                src={imageUrl(img)}
                alt={`thumb ${i}`}
                onClick={() => setActiveImage(i)}
                style={{ height: '70px', width: '100px', objectFit: 'cover', borderRadius: '8px', cursor: 'pointer', border: i === activeImage ? '3px solid #007bff' : '3px solid transparent', flexShrink: 0 }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: '0 0 8px', fontSize: '32px', color: '#1a1a2e' }}>{pkg.title}</h1>
          <p style={{ margin: 0, color: '#666', fontSize: '16px' }}>
            📍 {pkg.destination?.city}, {pkg.destination?.state}, {pkg.destination?.country}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
            <StarRating rating={Math.round(pkg.averageRating || 0)} />
            <span style={{ color: '#888', fontSize: '14px' }}>
              {pkg.averageRating ? `${pkg.averageRating} (${pkg.totalRatings} reviews)` : 'No reviews yet'}
            </span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '32px', fontWeight: '800', color: '#007bff' }}>₹{pkg.price?.toLocaleString()}</div>
          <div style={{ color: '#888', fontSize: '14px' }}>per adult</div>
          {pkg.childPrice > 0 && <div style={{ color: '#888', fontSize: '13px' }}>₹{pkg.childPrice} per child</div>}
          <button
            onClick={() => navigate(`/booking/${id}`)}
            style={{ marginTop: '12px', padding: '14px 32px', background: 'linear-gradient(135deg, #007bff, #0056b3)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,123,255,0.3)' }}
          >
            Book Now
          </button>
        </div>
      </div>

      {/* Key Info Pills */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '28px' }}>
        {[
          { icon: '🗓️', label: `${pkg.duration?.days}D / ${pkg.duration?.nights}N` },
          { icon: '📍', label: pkg.startingLocation },
          { icon: '🌟', label: pkg.bestTimeToVisit || 'Year-round' },
          { icon: '🏨', label: (pkg.roomTypes || []).join(', ') || '3 Star' },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', backgroundColor: '#f0f7ff', borderRadius: '20px', fontSize: '14px', color: '#333' }}>
            <span>{item.icon}</span><span>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: '1px solid #e0e0e0', display: 'flex', gap: '4px', marginBottom: '28px' }}>
        {['overview', 'itinerary', 'map', 'reviews'].map(tab => (
          <button key={tab} style={tabStyle(tab)} onClick={() => setActiveTab(tab)}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div>
          <h3 style={{ color: '#1a1a2e' }}>Description</h3>
          <p style={{ color: '#555', lineHeight: '1.8', fontSize: '15px' }}>{pkg.description}</p>

          {pkg.highlights && pkg.highlights.length > 0 && (
            <>
              <h3 style={{ color: '#1a1a2e', marginTop: '28px' }}>✨ Highlights</h3>
              <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '10px' }}>
                {pkg.highlights.map((h, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', backgroundColor: '#f8f9fa', borderRadius: '8px', fontSize: '14px' }}>
                    <span style={{ color: '#28a745', fontWeight: 'bold' }}>✓</span> {h}
                  </li>
                ))}
              </ul>
            </>
          )}

          {pkg.activities && pkg.activities.length > 0 && (
            <>
              <h3 style={{ color: '#1a1a2e', marginTop: '28px' }}>🎯 Activities</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {pkg.activities.map((a, i) => (
                  <span key={i} style={{ padding: '6px 14px', backgroundColor: '#e8f4fd', borderRadius: '20px', fontSize: '13px', color: '#007bff' }}>{a}</span>
                ))}
              </div>
            </>
          )}

          {(pkg.travelTips?.weather || pkg.travelTips?.culture || pkg.travelTips?.safety) && (
            <>
              <h3 style={{ color: '#1a1a2e', marginTop: '28px' }}>💡 Travel Tips</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
                {[
                  { key: 'weather', icon: '🌤️', label: 'Weather' },
                  { key: 'culture', icon: '🎭', label: 'Culture' },
                  { key: 'safety', icon: '🛡️', label: 'Safety' },
                  { key: 'clothing', icon: '👕', label: 'Clothing' },
                ].filter(t => pkg.travelTips?.[t.key]).map(tip => (
                  <div key={tip.key} style={{ padding: '16px', backgroundColor: '#fff9f0', border: '1px solid #ffe0b2', borderRadius: '10px' }}>
                    <div style={{ fontWeight: '600', marginBottom: '6px' }}>{tip.icon} {tip.label}</div>
                    <div style={{ color: '#666', fontSize: '14px', lineHeight: '1.6' }}>{pkg.travelTips[tip.key]}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === 'itinerary' && (
        <div>
          <h3 style={{ color: '#1a1a2e' }}>Day-by-Day Itinerary</h3>
          {pkg.itinerary && pkg.itinerary.length > 0 ? (
            <div style={{ position: 'relative', paddingLeft: '30px', borderLeft: '2px solid #007bff' }}>
              {pkg.itinerary.map((day, i) => (
                <div key={i} style={{ marginBottom: '24px', position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '-40px', width: '22px', height: '22px', backgroundColor: '#007bff', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>{i + 1}</div>
                  <div style={{ fontWeight: '600', marginBottom: '4px', color: '#1a1a2e' }}>Day {i + 1}</div>
                  <div style={{ color: '#555', lineHeight: '1.7', fontSize: '15px' }}>{day}</div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#888' }}>No itinerary available for this package.</p>
          )}
        </div>
      )}

      {activeTab === 'map' && (
        <MapTab destination={pkg.destination} coordinates={pkg.coordinates} />
      )}

      {activeTab === 'reviews' && (
        <div>
          <h3 style={{ color: '#1a1a2e' }}>Customer Reviews</h3>
          {reviews.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#888', backgroundColor: '#f9f9f9', borderRadius: '12px' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>💬</div>
              <p>No reviews yet. Be the first to share your experience!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {reviews.map((r) => (
                <div key={r._id} style={{ padding: '20px', backgroundColor: '#fafafa', borderRadius: '12px', border: '1px solid #eee' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ fontWeight: '600', color: '#1a1a2e' }}>{r.user?.name || 'Anonymous'}</div>
                    <div style={{ color: '#888', fontSize: '13px' }}>{new Date(r.createdAt).toLocaleDateString()}</div>
                  </div>
                  <StarRating rating={r.rating} />
                  <p style={{ marginTop: '10px', color: '#555', lineHeight: '1.7' }}>{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Lazy-loaded Map component to avoid issues when leaflet CSS isn't loaded yet
function MapTab({ destination, coordinates }) {
  const [MapComponent, setMapComponent] = useState(null);

  useEffect(() => {
    // Dynamically load leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    import('react-leaflet').then(({ MapContainer, TileLayer, Marker, Popup }) => {
      setMapComponent({ MapContainer, TileLayer, Marker, Popup });
    }).catch(console.error);

    return () => document.head.removeChild(link);
  }, []);

  const lat = coordinates?.lat || 20.5937;
  const lng = coordinates?.lng || 78.9629;
  const label = destination ? `${destination.city}, ${destination.country}` : 'Destination';

  if (!MapComponent) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px', backgroundColor: '#f0f7ff', borderRadius: '12px' }}>
      <span style={{ color: '#007bff' }}>Loading map...</span>
    </div>
  );

  const { MapContainer, TileLayer, Marker, Popup } = MapComponent;

  return (
    <div>
      <h3 style={{ color: '#1a1a2e' }}>📍 Destination on Map</h3>
      <p style={{ color: '#666', marginBottom: '16px' }}>
        {coordinates ? `Exact location: ${lat}, ${lng}` : `Approximate location for ${label}`}
      </p>
      <div style={{ height: '400px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e0e0e0' }}>
        <MapContainer center={[lat, lng]} zoom={7} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[lat, lng]}>
            <Popup>{label}</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}
