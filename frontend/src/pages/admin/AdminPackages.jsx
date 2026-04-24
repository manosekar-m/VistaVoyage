import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X, Clock } from 'lucide-react';
import AdminLayout from '../../components/shared/AdminLayout';
import api from '../../utils/api';

const emptyForm = { title: '', location: '', destinationCity: '', destinationState: '', destinationCountry: '', price: '', childPrice: '', duration: '', nights: '', startingLocation: '', bestTimeToVisit: '', description: '', status: 'Active', highlights: '', images: [], itinerary: [], includedActivities: '', availableFoodOptions: [], availableStayOptions: [], travelTips: { localCulture: '', safetyTips: '', weather: '', clothingSuggestions: '' }, lat: '', lng: '' };
const FOOD_OPTS = ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Jain'];
const STAY_OPTS = ['Standard Room', 'Deluxe Room', 'Suite', 'Luxury Resort'];
const TAB_ORDER = ['basic', 'pricing', 'config', 'itinerary', 'tips', 'media'];

export default function AdminPackages() {
  const [packages, setPackages] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [modal,    setModal]    = useState(false);
  const [editing,  setEditing]  = useState(null);
  const [form,     setForm]     = useState(emptyForm);
  const [saving,   setSaving]   = useState(false);
  const [imgFiles, setImgFiles] = useState([]);
  const [msg,      setMsg]      = useState('');
  const [activeTab, setActiveTab] = useState('basic');

  const fetchPackages = () => {
    setLoading(true);
    api.get('/packages')
      .then(r => setPackages(r.data.packages || []))
      .catch(e => { console.error('Packages error:', e); alert(e.response?.data?.message || 'Failed to load packages'); })
      .finally(() => setLoading(false));
  };
  useEffect(() => { fetchPackages(); }, []);

  const openModal = (pkg = null) => {
    if (pkg) {
      setEditing(pkg._id);
      setForm({
        title: pkg.title, location: pkg.location,
        destinationCity: pkg.destinationCity || '', destinationState: pkg.destinationState || '', destinationCountry: pkg.destinationCountry || '',
        price: pkg.price, childPrice: pkg.childPrice || Math.round(pkg.price * 0.5), duration: pkg.duration, nights: pkg.nights || '',
        startingLocation: pkg.startingLocation || '', bestTimeToVisit: pkg.bestTimeToVisit || '',
        description: pkg.description, status: pkg.status, highlights: (pkg.highlights || []).join(', '), images: pkg.images || [],
        itinerary: (pkg.itinerary || []).map(i => ({ day: i.day, title: i.title, activitiesText: (i.activities || []).join('\n') })),
        includedActivities: (pkg.includedActivities || []).join('\n'),
        availableFoodOptions: pkg.availableFoodOptions || [],
        availableStayOptions: pkg.availableStayOptions || [],
        travelTips: { localCulture: pkg.travelTips?.localCulture || '', safetyTips: pkg.travelTips?.safetyTips || '', weather: pkg.travelTips?.weather || '', clothingSuggestions: pkg.travelTips?.clothingSuggestions || '' },
        lat: pkg.coordinates?.lat || '', lng: pkg.coordinates?.lng || ''
      });
    } else {
      setEditing(null);
      setForm(emptyForm);
    }
    setImgFiles([]);
    setModal(true);
    setActiveTab('basic');
    setMsg('');
  };

  const handleSave = async e => {
    e.preventDefault();
    setMsg('');

    if (activeTab !== 'media') {
      const nextIdx = TAB_ORDER.indexOf(activeTab) + 1;
      if (nextIdx < TAB_ORDER.length) {
        setActiveTab(TAB_ORDER[nextIdx]);
      }
      return;
    }

    const totalImages = imgFiles.length + (form.images ? form.images.length : 0);
    if (totalImages === 0) {
      setMsg('Please upload at least one image for the package.');
      return;
    }

    setSaving(true);
    try {
      const fd = new FormData();
      // Only append fields that have values
      Object.entries(form).forEach(([k, v]) => { 
        if (k === 'images') {
          // Send existing image URLs as a JSON string so backend knows which to keep
          fd.append('existingImages', JSON.stringify(v));
        } else if (k === 'travelTips') {
          fd.append(k, JSON.stringify(v));
        } else {
          fd.append(k, v);
        }
      });

      fd.set('highlights', JSON.stringify((form.highlights || '').split(',').map(h => h.trim()).filter(Boolean)));
      fd.set('itinerary', JSON.stringify((form.itinerary || []).map(i => ({ day: i.day, title: i.title, activities: (i.activitiesText || '').split('\n').map(l=>l.trim()).filter(Boolean) }))));
      fd.set('includedActivities', JSON.stringify((form.includedActivities || '').split('\n').map(a => a.trim()).filter(Boolean)));
      fd.set('availableFoodOptions', JSON.stringify(form.availableFoodOptions));
      fd.set('availableStayOptions', JSON.stringify(form.availableStayOptions));
      
      // Append new image files
      imgFiles.forEach(f => fd.append('images', f));

      if (editing) await api.put(`/packages/${editing}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      else         await api.post('/packages', fd, { headers: { 'Content-Type': 'multipart/form-data' } });

      setModal(false);
      fetchPackages();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Save failed');
    } finally { setSaving(false); }
  };

  const deletePackage = async id => {
    if (!window.confirm('Delete this package?')) return;
    await api.delete(`/packages/${id}`);
    fetchPackages();
  };

  return (
    <AdminLayout>
      <style>{`
        .pkg-admin-input { width: 100%; padding: 12px 16px; border: 1.5px solid var(--border-color); border-radius: 12px; font-size: 14px; color: var(--text-main); background: var(--bg-card); outline: none; transition: all 0.25s; font-family: inherit; box-sizing: border-box; }
        .pkg-admin-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(201,168,76,0.12); }
        .pkg-admin-input::placeholder { color: var(--text-muted); opacity: 0.7; }
        .pkg-admin-label { display: block; font-size: 11px; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px; }
        .pkg-step-btn { width: 100%; text-align: left; background: none; border: none; padding: 14px 20px; cursor: pointer; border-radius: 14px; transition: all 0.25s; display: flex; align-items: center; gap: 14px; }
        .pkg-step-btn:hover { background: rgba(13,37,53,0.04); }
        :root.dark .pkg-step-btn:hover { background: rgba(255,255,255,0.04); }
        .pkg-step-btn.active { background: rgba(201,168,76,0.1); }
        .pkg-chip-check { padding: 9px 18px; border-radius: 30px; font-size: 13px; font-weight: 700; cursor: pointer; border: 1.5px solid var(--border-color); background: var(--bg-card); color: var(--text-muted); transition: all 0.25s; }
        .pkg-chip-check.checked { background: var(--primary); color: white; border-color: var(--primary); box-shadow: 0 4px 14px rgba(13,37,53,0.18); }
        .pkg-chip-check:hover:not(.checked) { border-color: var(--accent); }
        .itin-card { background: var(--bg-card); border: 1.5px solid var(--border-color); border-radius: 16px; padding: 20px 24px; transition: all 0.25s; }
        .itin-card:hover { border-color: var(--accent); box-shadow: 0 4px 16px rgba(201,168,76,0.08); }
      `}</style>

      <div style={{ padding: '32px 36px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.2rem', color: 'var(--text-main)', fontWeight: 700, margin: 0 }}>Packages</h1>
            <p style={{ color: 'var(--text-muted)', marginTop: 6, fontSize: 14, fontWeight: 500 }}>{packages.length} travel packages · Manage your catalogue</p>
          </div>
          <button onClick={() => openModal()} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 28px', background: 'linear-gradient(135deg, var(--primary), #0a2540)', color: 'white', border: 'none', borderRadius: 14, cursor: 'pointer', fontWeight: 700, fontSize: 14, transition: 'all 0.3s', boxShadow: '0 6px 20px rgba(13,37,53,0.25)' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(13,37,53,0.3)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(13,37,53,0.25)'; }}>
            <Plus size={18}/> Add New Package
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 80 }}><div className="spinner" style={{ width: 40, height: 40, borderWidth: 3, margin: '0 auto' }}/></div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 28 }}>
            {packages.map(pkg => (
              <div key={pkg._id} style={{ background: 'var(--bg-card)', borderRadius: 20, boxShadow: 'var(--shadow)', overflow: 'hidden', transition: 'all 0.4s', border: '1px solid var(--border-color)' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow)'; }}>
                <div style={{ position: 'relative', height: 200 }}>
                  <img src={pkg.images?.[0] || 'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?w=600'} alt={pkg.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 55%)' }}/>
                  <div style={{ position: 'absolute', top: 14, right: 14, display: 'flex', gap: 8 }}>
                    <button onClick={() => openModal(pkg)} style={{ width: 36, height: 36, background: 'var(--bg-card)', border: 'none', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.15)', transition: 'all 0.2s', color: 'var(--text-main)' }}
                      onMouseEnter={e => e.currentTarget.style.opacity = 0.8} onMouseLeave={e => e.currentTarget.style.opacity = 1}><Edit2 size={14}/></button>
                    <button onClick={() => deletePackage(pkg._id)} style={{ width: 36, height: 36, background: 'var(--bg-card)', border: 'none', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.15)', transition: 'all 0.2s', color: 'var(--danger)' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#fff5f5'} onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-card)'}><Trash2 size={14}/></button>
                  </div>
                  <span style={{ position: 'absolute', top: 14, left: 14, background: pkg.status === 'Active' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', color: pkg.status === 'Active' ? 'var(--success)' : 'var(--danger)', padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 800, letterSpacing: 1, backdropFilter: 'blur(4px)', textTransform: 'uppercase' }}>{pkg.status}</span>
                  <div style={{ position: 'absolute', bottom: 14, left: 16, right: 16 }}>
                    <div style={{ color: 'var(--accent)', fontSize: 11, fontWeight: 800, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 4 }}>{pkg.location}</div>
                    <div style={{ color: 'white', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', fontWeight: 700, lineHeight: 1.2 }}>{pkg.title}{pkg.nights ? ` – ${pkg.duration}D/${pkg.nights}N` : ''}</div>
                  </div>
                </div>
                <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: 14 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}><Clock size={12} color="var(--accent)"/>{pkg.duration}d</span>
                    {pkg.availableFoodOptions?.length > 0 && <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>🍽 {pkg.availableFoodOptions.length}</span>}
                    {pkg.availableStayOptions?.length > 0 && <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>🏨 {pkg.availableStayOptions.length}</span>}
                  </div>
                  <span style={{ fontWeight: 800, fontSize: 16, color: 'var(--text-main)', fontFamily: 'Cormorant Garamond, serif' }}>₹{pkg.price?.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Premium Full-Drawer Modal ── */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(5,15,30,0.6)', zIndex: 300, display: 'flex', alignItems: 'stretch', justifyContent: 'flex-end', backdropFilter: 'blur(4px)' }}
          onClick={e => e.target === e.currentTarget && setModal(false)}>

          <div style={{ width: '100%', maxWidth: 980, background: 'var(--bg-page)', height: '100vh', display: 'flex', flexDirection: 'column', animation: 'slideInRight 0.4s cubic-bezier(0.23,1,0.32,1)', boxShadow: '-20px 0 80px rgba(0,0,0,0.2)' }}>
            <style>{`@keyframes slideInRight { from { transform: translateX(60px); opacity:0; } to { transform: translateX(0); opacity:1; } }`}</style>

            {/* Drawer header */}
            <div style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #0a2540 100%)', padding: '28px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <div>
                <div style={{ color: 'var(--accent)', fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>
                  {editing ? 'Edit Package' : 'New Package'}
                </div>
                <h2 style={{ color: 'white', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', fontWeight: 700, margin: 0, lineHeight: 1.1 }}>
                  {form.title || (editing ? 'Edit Package' : 'Create a New Package')}
                </h2>
              </div>
              <button onClick={() => setModal(false)} style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', flexShrink: 0 }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
                <X size={20}/>
              </button>
            </div>

            {/* Body: Sidebar + Content */}
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

              {/* Left Stepper Sidebar */}
              <div style={{ width: 240, background: 'var(--bg-card)', borderRight: '1px solid var(--border-color)', padding: '32px 16px', display: 'flex', flexDirection: 'column', gap: 4, flexShrink: 0, overflowY: 'auto' }}>
                {[
                  { id: 'basic',     icon: '📋', label: 'Basic Info',     desc: 'Title, location, details' },
                  { id: 'pricing',   icon: '💰', label: 'Pricing & Time', desc: 'Price, duration, dates' },
                  { id: 'config',    icon: '⚙️', label: 'Preferences',    desc: 'Food, stay, activities' },
                  { id: 'itinerary', icon: '🗺️', label: 'Itinerary',      desc: 'Day-by-day plan' },
                  { id: 'tips',      icon: '✈️', label: 'Travel Tips',    desc: 'Culture, weather, safety' },
                  { id: 'media',     icon: '🖼️', label: 'Media',          desc: 'Upload images' },
                ].map(tab => {
                  const tabIdx = TAB_ORDER.indexOf(tab.id);
                  const activeIdx = TAB_ORDER.indexOf(activeTab);
                  const isDone = tabIdx < activeIdx;
                  const isActive = tab.id === activeTab;
                  return (
                    <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`pkg-step-btn${isActive ? ' active' : ''}`}>
                      <div style={{ width: 40, height: 40, borderRadius: 12, background: isDone ? 'var(--success)' : isActive ? 'linear-gradient(135deg, var(--primary), #0a2540)' : 'var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: isDone ? 16 : 18, flexShrink: 0, boxShadow: isActive ? '0 4px 14px rgba(13,37,53,0.2)' : 'none', transition: 'all 0.3s', color: isDone ? 'white' : 'inherit' }}>
                        {isDone ? '✓' : tab.icon}
                      </div>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: 13, fontWeight: isActive ? 800 : 600, color: isActive ? 'var(--accent)' : 'var(--text-main)', lineHeight: 1.2, marginBottom: 3 }}>{tab.label}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>{tab.desc}</div>
                      </div>
                    </button>
                  );
                })}

                {/* Progress bar */}
                <div style={{ marginTop: 'auto', padding: '20px 16px 0' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 10 }}>
                    Step {TAB_ORDER.indexOf(activeTab) + 1} / {TAB_ORDER.length}
                  </div>
                  <div style={{ height: 6, background: 'var(--gray-200)', borderRadius: 6, overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: 'linear-gradient(90deg, var(--accent), #e6be58)', borderRadius: 6, width: `${((TAB_ORDER.indexOf(activeTab) + 1) / TAB_ORDER.length) * 100}%`, transition: 'width 0.4s ease' }}/>
                  </div>
                </div>
              </div>

              {/* Right Form Content */}
              <form onSubmit={handleSave} style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1, overflowY: 'auto', padding: '36px 44px' }}>

                  {msg && (
                    <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '14px 20px', borderRadius: 14, marginBottom: 24, fontSize: 14, fontWeight: 600 }}>
                      ⚠️ {msg}
                    </div>
                  )}

                  {/* ── BASIC INFO ── */}
                  {activeTab === 'basic' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                      <div>
                        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem', color: 'var(--text-main)', fontWeight: 700, marginBottom: 6 }}>Basic Information</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: 14, fontWeight: 500 }}>Set the core details of this package</div>
                      </div>
                      <div>
                        <label className="pkg-admin-label">Package Title *</label>
                        <input className="pkg-admin-input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required placeholder="e.g. Ooty Hill Station Delight"/>
                        {form.title && <div style={{ fontSize: 12, color: '#a09387', marginTop: 8, fontWeight: 500 }}>Preview: <strong style={{ color: 'var(--accent)' }}>{form.title}{form.nights ? ` – ${form.duration || '?'} Days / ${form.nights} Nights` : ''}</strong></div>}
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                        <div>
                          <label className="pkg-admin-label">Main Location *</label>
                          <input className="pkg-admin-input" value={form.location} onChange={e => setForm({...form, location: e.target.value})} required placeholder="e.g. Ooty, Tamil Nadu"/>
                        </div>
                        <div>
                          <label className="pkg-admin-label">Status</label>
                          <select className="pkg-admin-input" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                            <option>Active</option><option>Inactive</option>
                          </select>
                        </div>
                        <div>
                          <label className="pkg-admin-label">Destination City</label>
                          <input className="pkg-admin-input" value={form.destinationCity} onChange={e => setForm({...form, destinationCity: e.target.value})} placeholder="Ooty"/>
                        </div>
                        <div>
                          <label className="pkg-admin-label">Destination State</label>
                          <input className="pkg-admin-input" value={form.destinationState} onChange={e => setForm({...form, destinationState: e.target.value})} placeholder="Tamil Nadu"/>
                        </div>
                        <div>
                          <label className="pkg-admin-label">Destination Country</label>
                          <input className="pkg-admin-input" value={form.destinationCountry} onChange={e => setForm({...form, destinationCountry: e.target.value})} placeholder="India"/>
                        </div>
                        <div>
                          <label className="pkg-admin-label">Highlights (comma separated)</label>
                          <input className="pkg-admin-input" value={form.highlights} onChange={e => setForm({...form, highlights: e.target.value})} placeholder="Toy Train, Tea Gardens"/>
                        </div>
                        <div>
                          <label className="pkg-admin-label">Latitude</label>
                          <input className="pkg-admin-input" type="number" step="any" value={form.lat} onChange={e => setForm({...form, lat: e.target.value})} placeholder="28.6139"/>
                        </div>
                        <div>
                          <label className="pkg-admin-label">Longitude</label>
                          <input className="pkg-admin-input" type="number" step="any" value={form.lng} onChange={e => setForm({...form, lng: e.target.value})} placeholder="77.2090"/>
                        </div>
                      </div>
                      <div>
                        <label className="pkg-admin-label">Description *</label>
                        <textarea className="pkg-admin-input" value={form.description} onChange={e => setForm({...form, description: e.target.value})} required placeholder="Write a compelling description of the package experience..." style={{ minHeight: 110, resize: 'vertical' }}/>
                      </div>
                    </div>
                  )}

                  {/* ── PRICING & TIME ── */}
                  {activeTab === 'pricing' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                      <div>
                        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem', color: 'var(--text-main)', fontWeight: 700, marginBottom: 6 }}>Pricing & Duration</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: 14, fontWeight: 500 }}>Set pricing, days, and travel windows</div>
                      </div>

                      {form.price && (
                        <div style={{ background: 'linear-gradient(135deg, var(--primary), #0a2540)', borderRadius: 20, padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 700, marginBottom: 4 }}>Adult Price</div>
                            <div style={{ color: 'var(--accent)', fontFamily: 'Cormorant Garamond, serif', fontSize: '2.4rem', fontWeight: 700, lineHeight: 1 }}>₹{Number(form.price).toLocaleString()}</div>
                          </div>
                          {form.childPrice && (
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 700, marginBottom: 4 }}>Child Price</div>
                              <div style={{ color: 'white', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem', fontWeight: 700, lineHeight: 1 }}>₹{Number(form.childPrice).toLocaleString()}</div>
                            </div>
                          )}
                        </div>
                      )}

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                        <div>
                          <label className="pkg-admin-label">Adult Price (₹) *</label>
                          <input className="pkg-admin-input" type="number" value={form.price} onChange={e => { const p = e.target.value; setForm({...form, price: p, childPrice: p ? Math.round(Number(p)*0.5) : ''}); }} required placeholder="4500"/>
                        </div>
                        <div>
                          <label className="pkg-admin-label">Child Price (₹) <span style={{ fontWeight: 500, color: '#b0a898' }}>(auto 50%)</span></label>
                          <input className="pkg-admin-input" type="number" value={form.childPrice} onChange={e => setForm({...form, childPrice: e.target.value})} placeholder="2250"/>
                        </div>
                        <div>
                          <label className="pkg-admin-label">Duration (Days) *</label>
                          <input className="pkg-admin-input" type="number" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} required placeholder="3"/>
                        </div>
                        <div>
                          <label className="pkg-admin-label">Nights</label>
                          <input className="pkg-admin-input" type="number" value={form.nights} onChange={e => setForm({...form, nights: e.target.value})} placeholder="2"/>
                        </div>
                        <div>
                          <label className="pkg-admin-label">Starting Location</label>
                          <input className="pkg-admin-input" value={form.startingLocation} onChange={e => setForm({...form, startingLocation: e.target.value})} placeholder="Hyderabad / Delhi"/>
                        </div>
                        <div>
                          <label className="pkg-admin-label">Best Time to Visit</label>
                          <input className="pkg-admin-input" value={form.bestTimeToVisit} onChange={e => setForm({...form, bestTimeToVisit: e.target.value})} placeholder="Oct – March"/>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── PREFERENCES ── */}
                  {activeTab === 'config' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                      <div>
                        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem', color: 'var(--text-main)', fontWeight: 700, marginBottom: 6 }}>Guest Preferences</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: 14, fontWeight: 500 }}>Configure what guests can choose at booking</div>
                      </div>

                      <div style={{ background: 'var(--bg-card)', borderRadius: 20, padding: '28px 32px', border: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                          <div style={{ width: 40, height: 40, background: 'rgba(201,168,76,0.15)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🍽️</div>
                          <div>
                            <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: 14 }}>Food Preferences</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>Select options guests can choose from</div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                          {FOOD_OPTS.map(opt => (
                            <button key={opt} type="button" className={`pkg-chip-check${form.availableFoodOptions.includes(opt) ? ' checked' : ''}`}
                              onClick={() => {
                                if (form.availableFoodOptions.includes(opt)) setForm({...form, availableFoodOptions: form.availableFoodOptions.filter(f => f !== opt)});
                                else setForm({...form, availableFoodOptions: [...form.availableFoodOptions, opt]});
                              }}>{opt}</button>
                          ))}
                        </div>
                      </div>

                      <div style={{ background: 'var(--bg-card)', borderRadius: 20, padding: '28px 32px', border: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                          <div style={{ width: 40, height: 40, background: 'rgba(26,58,74,0.1)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🏨</div>
                          <div>
                            <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: 14 }}>Stay Options</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>Select hotel categories available</div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                          {STAY_OPTS.map(opt => (
                            <button key={opt} type="button" className={`pkg-chip-check${form.availableStayOptions.includes(opt) ? ' checked' : ''}`}
                              onClick={() => {
                                if (form.availableStayOptions.includes(opt)) setForm({...form, availableStayOptions: form.availableStayOptions.filter(f => f !== opt)});
                                else setForm({...form, availableStayOptions: [...form.availableStayOptions, opt]});
                              }}>{opt}</button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="pkg-admin-label">Included Activities (one per line)</label>
                        <textarea className="pkg-admin-input" value={form.includedActivities} onChange={e => setForm({...form, includedActivities: e.target.value})} placeholder={'Scuba Diving\nBoat Ride\nCultural Show\nTrekking'} style={{ minHeight: 130, resize: 'vertical' }}/>
                      </div>
                    </div>
                  )}

                  {/* ── ITINERARY ── */}
                  {activeTab === 'itinerary' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem', color: 'var(--text-main)', fontWeight: 700, marginBottom: 6 }}>Day-by-Day Itinerary</div>
                          <div style={{ color: 'var(--text-muted)', fontSize: 14, fontWeight: 500 }}>Plan activities for each day ({form.duration || '?'} total days)</div>
                        </div>
                        <button type="button" onClick={() => {
                          const dur = parseInt(form.duration) || 0;
                          if (!dur) { alert('Please set Duration in Pricing & Time tab first.'); setActiveTab('pricing'); return; }
                          let it = [...(form.itinerary || [])];
                          if (it.length < dur) for (let i = it.length; i < dur; i++) it.push({ day: i+1, title: `Day ${i+1}`, activitiesText: '' });
                          else it = it.slice(0, dur);
                          setForm({...form, itinerary: it});
                        }} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 12, cursor: 'pointer', fontSize: 13, fontWeight: 700, transition: 'all 0.25s', flexShrink: 0 }}
                          onMouseEnter={e => e.currentTarget.style.background = '#0a2540'}
                          onMouseLeave={e => e.currentTarget.style.background = 'var(--primary)'}>
                          ⚡ Generate {form.duration || '?'} Days
                        </button>
                      </div>

                      {(form.itinerary || []).length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '60px 40px', background: 'var(--bg-card)', borderRadius: 20, border: '2px dashed var(--border-color)' }}>
                          <div style={{ fontSize: 48, marginBottom: 16 }}>🗺️</div>
                          <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>No itinerary yet</div>
                          <div style={{ color: 'var(--text-muted)', fontSize: 14 }}>Set a duration and click "Generate Days" above</div>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                          {(form.itinerary || []).map((itin, index) => (
                            <div key={index} className="itin-card">
                              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 14 }}>
                                <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg, var(--primary), #0a2540)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 14, flexShrink: 0, boxShadow: '0 4px 12px rgba(13,37,53,0.2)' }}>
                                  D{itin.day || index + 1}
                                </div>
                                <div style={{ flex: 1 }}>
                                  <label className="pkg-admin-label" style={{ marginBottom: 6 }}>Day Title</label>
                                  <input className="pkg-admin-input" value={itin.title} onChange={e => { const n = [...form.itinerary]; n[index].title = e.target.value; setForm({...form, itinerary: n}); }} placeholder={`Day ${itin.day || index + 1}: Arrival & Exploration`}/>
                                </div>
                              </div>
                              <div>
                                <label className="pkg-admin-label">Activities (one per line)</label>
                                <textarea className="pkg-admin-input" value={itin.activitiesText} onChange={e => { const n = [...form.itinerary]; n[index].activitiesText = e.target.value; setForm({...form, itinerary: n}); }} placeholder={'Check in to hotel\nEvening beach walk\nWelcome dinner'} style={{ minHeight: 90, resize: 'vertical' }}/>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── TRAVEL TIPS ── */}
                  {activeTab === 'tips' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                      <div>
                        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem', color: 'var(--text-main)', fontWeight: 700, marginBottom: 6 }}>Travel Tips</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: 14, fontWeight: 500 }}>Helpful guidance shown to guests on the trip detail page</div>
                      </div>
                      {[
                        { key: 'localCulture',        icon: '🏛️', label: 'Local Culture',       color: 'rgba(168,85,247,0.1)', border: 'rgba(168,85,247,0.2)', placeholder: 'Describe local customs, festivals, etiquette, and things to respect...' },
                        { key: 'safetyTips',          icon: '🛡️', label: 'Safety Tips',         color: 'rgba(34,197,94,0.1)',  border: 'rgba(34,197,94,0.2)',  placeholder: 'Mention emergency numbers, things to avoid, safety precautions...' },
                        { key: 'weather',             icon: '☀️', label: 'Weather & Best Time',  color: 'rgba(234,179,8,0.1)',   border: 'rgba(234,179,8,0.2)',   placeholder: 'Describe temperature ranges, monsoon periods, ideal visit windows...' },
                        { key: 'clothingSuggestions', icon: '👗', label: 'Clothing Suggestions', color: 'rgba(236,72,153,0.1)', border: 'rgba(236,72,153,0.2)', placeholder: 'Recommend what to pack - warm clothes, light cotton, waterproof gear...' },
                      ].map(({ key, icon, label, color, border, placeholder }) => (
                        <div key={key} style={{ background: color, border: `1px solid ${border}`, borderRadius: 18, padding: '22px 26px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                            <span style={{ fontSize: 24 }}>{icon}</span>
                            <label className="pkg-admin-label" style={{ margin: 0, fontSize: 12 }}>{label}</label>
                          </div>
                          <textarea className="pkg-admin-input" value={form.travelTips[key]} onChange={e => setForm({ ...form, travelTips: { ...form.travelTips, [key]: e.target.value } })} placeholder={placeholder} style={{ minHeight: 80, resize: 'vertical' }}/>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* ── MEDIA ── */}
                  {activeTab === 'media' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                      <div>
                        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem', color: 'var(--text-main)', fontWeight: 700, marginBottom: 6 }}>Package Images</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: 14, fontWeight: 500 }}>Upload up to 5 high-quality images to showcase this package</div>
                      </div>

                      <div style={{ border: '2px dashed var(--border-color)', borderRadius: 24, padding: '60px 40px', textAlign: 'center', cursor: 'pointer', background: 'var(--bg-card)', transition: 'all 0.3s' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'var(--bg-page)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.background = 'var(--bg-card)'; }}
                        onClick={() => document.getElementById('pkg-images').click()}>
                        <div style={{ fontSize: 56, marginBottom: 16 }}>📷</div>
                        <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: 16, marginBottom: 8 }}>Click to Upload Images</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 16 }}>JPG, PNG, WEBP · Max 5 images · High-res recommended</div>
                        {imgFiles.length > 0 && (
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#d1fae5', color: '#065f46', padding: '8px 20px', borderRadius: 30, fontSize: 13, fontWeight: 800 }}>
                            ✓ {imgFiles.length} image{imgFiles.length > 1 ? 's' : ''} selected
                          </div>
                        )}
                        <input id="pkg-images" type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={e => setImgFiles(Array.from(e.target.files).slice(0,5))}/>
                      </div>

                      {imgFiles.length > 0 && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 12 }}>
                          {imgFiles.map((f, i) => (
                            <div key={i} style={{ position: 'relative', height: 100, borderRadius: 12, overflow: 'hidden', border: '2px solid var(--border-color)' }}>
                              <img src={URL.createObjectURL(f)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                              <button type="button" onClick={() => setImgFiles(prev => prev.filter((_, j) => j !== i))} style={{ position: 'absolute', top: 4, right: 4, width: 22, height: 22, background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%', cursor: 'pointer', color: 'white', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                            </div>
                          ))}
                        </div>
                      )}

                      {editing && form.images?.length > 0 && (
                        <div style={{ marginBottom: 20 }}>
                          <label className="pkg-admin-label">Existing Images</label>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 12 }}>
                            {form.images.map((img, i) => (
                              <div key={i} style={{ position: 'relative', height: 80, borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                                <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                                <button type="button" onClick={() => setForm({ ...form, images: form.images.filter((_, j) => j !== i) })} style={{ position: 'absolute', top: 4, right: 4, width: 22, height: 22, background: 'rgba(239,68,68,0.8)', border: 'none', borderRadius: '50%', cursor: 'pointer', color: 'white', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                              </div>
                            ))}
                          </div>
                          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>Keeping {form.images.length} images. Upload new files to add more.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Sticky Footer */}
                <div style={{ borderTop: '1px solid var(--border-color)', padding: '20px 44px', background: 'var(--bg-card)', display: 'flex', gap: 14, alignItems: 'center', flexShrink: 0 }}>
                  {TAB_ORDER.indexOf(activeTab) > 0 && (
                    <button type="button" onClick={() => setActiveTab(TAB_ORDER[TAB_ORDER.indexOf(activeTab) - 1])} style={{ padding: '0 24px', height: 48, background: 'var(--gray-100)', color: 'var(--text-main)', border: 'none', borderRadius: 12, cursor: 'pointer', fontWeight: 700, fontSize: 14, transition: 'all 0.25s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--gray-200)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'var(--gray-100)'}>
                      ← Back
                    </button>
                  )}
                  <button type="button" onClick={() => setModal(false)} style={{ padding: '0 20px', height: 48, background: 'var(--bg-card)', color: 'var(--text-muted)', border: '1.5px solid var(--border-color)', borderRadius: 12, cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>Cancel</button>
                  <div style={{ flex: 1 }}/>
                  {TAB_ORDER.indexOf(activeTab) < TAB_ORDER.length - 1 ? (
                    <button type="button" onClick={() => setActiveTab(TAB_ORDER[TAB_ORDER.indexOf(activeTab) + 1])} style={{ padding: '0 40px', height: 48, background: 'linear-gradient(135deg, var(--primary), #0a2540)', color: 'white', border: 'none', borderRadius: 12, cursor: 'pointer', fontWeight: 800, fontSize: 15, display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.3s', boxShadow: '0 6px 20px rgba(13,37,53,0.22)' }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(13,37,53,0.3)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(13,37,53,0.22)'; }}>
                      Continue <span style={{ fontSize: 18 }}>→</span>
                    </button>
                  ) : (
                    <button type="submit" disabled={saving} style={{ padding: '0 44px', height: 48, background: 'linear-gradient(135deg, #c9a84c, #e6c76a)', color: 'var(--primary)', border: 'none', borderRadius: 12, cursor: saving ? 'not-allowed' : 'pointer', fontWeight: 900, fontSize: 15, display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.3s', boxShadow: '0 6px 20px rgba(201,168,76,0.3)', opacity: saving ? 0.7 : 1 }}
                      onMouseEnter={e => { if(!saving){ e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(201,168,76,0.4)'; }}}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(201,168,76,0.3)'; }}>
                      {saving ? <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2, borderTopColor: 'var(--primary)' }}/> : <>{editing ? '✓ Update Package' : '✓ Add Package'}</>}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
