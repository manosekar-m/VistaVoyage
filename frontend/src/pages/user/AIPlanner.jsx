import React, { useState } from 'react';
import { Sparkles, Send, MapPin, Calendar, Users, Info, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import api from '../../utils/api';

export default function AIPlanner() {
  const [formData, setFormData] = useState({ destination: '', days: '', travelers: 'Couple', preferences: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/ai-planner/generate-itinerary', formData);
      if (data.success) setResult(data.itinerary);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to connect to AI Architect. Please try again.';
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const savePDF = () => {
    if (!result) return;
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(10, 22, 40); // var(--primary-navy)
    doc.text(result.title, 20, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(result.summary, 20, 30, { maxWidth: 170 });
    
    let y = 50;
    result.itinerary.forEach(day => {
      if (y > 250) { doc.addPage(); y = 20; }
      doc.setFontSize(14);
      doc.setTextColor(201, 168, 76); // var(--accent)
      doc.text(`Day ${day.day}: ${day.title}`, 20, y);
      y += 10;
      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);
      day.activities.forEach(act => {
        doc.text(`- ${act}`, 30, y, { maxWidth: 150 });
        y += 7;
        if (y > 270) { doc.addPage(); y = 20; }
      });
      y += 5;
    });
    
    y += 10;
    if (y > 250) { doc.addPage(); y = 20; }
    doc.setFontSize(13);
    doc.setTextColor(201, 168, 76);
    doc.text("Architect's Tips:", 20, y);
    y += 10;
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    doc.text(result.travelTips, 20, y, { maxWidth: 170 });
    
    doc.save(`VistaVoyage_AI_${result.title.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div style={{ paddingTop: 80, minHeight: '100vh', background: 'var(--bg-page)', paddingBottom: 100 }}>
      <style>{`
        .ai-grid { display: grid; gridTemplateColumns: 350px 1fr; gap: 40px; }
        .ai-hero-title { font-size: 3.5rem; }
        
        @media (max-width: 992px) {
          .ai-grid { grid-template-columns: 1fr !important; gap: 32px; }
          .ai-hero-title { font-size: 2.5rem !important; }
          .ai-form-card { padding: 24px !important; }
          .ai-result-card { padding: 24px !important; }
          .itinerary-day { padding: 16px !important; }
          .itinerary-list { padding-left: 32px !important; }
        }
      `}</style>

      <div className="container" style={{ maxWidth: 1000 }}>
        
        <div style={{ textAlign: 'center', marginBottom: 40, padding: '0 24px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(201,168,76,0.1)', padding: '8px 20px', borderRadius: 40, color: 'var(--accent)', fontWeight: 700, fontSize: 13, marginBottom: 16 }}>
            <Sparkles size={14} />
            Powered by VistaVoyage AI
          </div>
          <h1 className="ai-hero-title" style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--text-main)', marginBottom: 16, fontWeight: 700 }}>AI Travel Architect</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 16, maxWidth: 600, margin: '0 auto', lineHeight: 1.6 }}>
            Describe your dream escape and let our intelligent architect craft a bespoke journey just for you.
          </p>
        </div>

        <div className="ai-grid" style={{ transition: 'all 0.5s ease', padding: '0 16px' }}>
          
          {/* Form Section */}
          <div className="ai-form-card" style={{ background: 'var(--bg-card)', borderRadius: 24, padding: 32, border: '1px solid var(--border-color)', boxShadow: 'var(--shadow)', height: 'fit-content' }}>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 10, letterSpacing: 1 }}>
                  <MapPin size={12} /> Destination
                </label>
                <input 
                  required
                  className="form-input" 
                  placeholder="e.g. Switzerland, Bali, Kerala"
                  value={formData.destination}
                  onChange={e => setFormData({...formData, destination: e.target.value})}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 10, letterSpacing: 1 }}>
                    <Calendar size={12} /> Duration
                  </label>
                  <input 
                    required
                    type="number"
                    className="form-input" 
                    placeholder="Days"
                    value={formData.days}
                    onChange={e => setFormData({...formData, days: e.target.value})}
                  />
                </div>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 10, letterSpacing: 1 }}>
                    <Users size={12} /> Travelers
                  </label>
                  <select 
                    className="form-input"
                    value={formData.travelers}
                    onChange={e => setFormData({...formData, travelers: e.target.value})}
                  >
                    <option>Solo</option>
                    <option>Couple</option>
                    <option>Family</option>
                    <option>Friends</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 10, letterSpacing: 1 }}>
                  <Info size={12} /> Preferences
                </label>
                <textarea 
                  className="form-input" 
                  style={{ minHeight: 100, padding: 15, resize: 'none' }}
                  placeholder="e.g. Adventure-focused, kid-friendly..."
                  value={formData.preferences}
                  onChange={e => setFormData({...formData, preferences: e.target.value})}
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                style={{ width: '100%', padding: 16, background: 'var(--accent)', color: 'var(--primary-navy)', border: 'none', borderRadius: 12, fontWeight: 800, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, opacity: loading ? 0.7 : 1 }}
              >
                {loading ? <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : <><Sparkles size={16} /> Craft My Journey</>}
              </button>
            </form>
          </div>

          {/* Result Section */}
          {result && (
            <div style={{ animation: 'fadeIn 0.8s ease' }}>
              <div className="ai-result-card" style={{ background: 'var(--bg-card)', borderRadius: 24, padding: 40, border: '1px solid var(--border-color)', boxShadow: 'var(--shadow)', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 20 }}>
                  <div>
                    <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.2rem', color: 'var(--text-main)', marginBottom: 8, fontWeight: 700 }}>{result.title}</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: 15, fontStyle: 'italic', lineHeight: 1.5 }}>{result.summary}</p>
                  </div>
                  <button 
                    onClick={savePDF}
                    style={{ background: 'var(--gray-100)', color: 'var(--text-main)', border: 'none', padding: '10px 18px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontWeight: 700, fontSize: 13 }}
                  >
                    <Download size={14} /> Save PDF
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {result.itinerary.map((day, idx) => (
                    <div key={idx} className="itinerary-day" style={{ padding: 24, background: 'var(--bg-page)', borderRadius: 20, border: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--accent)', color: 'var(--primary-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14 }}>{day.day}</div>
                        <h3 style={{ fontSize: 17, color: 'var(--text-main)', fontWeight: 700, margin: 0 }}>{day.title}</h3>
                      </div>
                      <ul className="itinerary-list" style={{ paddingLeft: 48, margin: 0 }}>
                        {day.activities.map((act, i) => (
                          <li key={i} style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 6, lineHeight: 1.5 }}>{act}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 32, padding: 20, background: 'rgba(201,168,76,0.04)', borderRadius: 16, border: '1px dashed var(--accent)' }}>
                  <h4 style={{ color: 'var(--accent)', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8, letterSpacing: 1 }}><Info size={14} /> Architect's Tips</h4>
                  <p style={{ color: 'var(--text-main)', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{result.travelTips}</p>
                </div>
              </div>
            </div>
          )}

          {!result && !loading && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.15 }}>
              <div style={{ textAlign: 'center' }}>
                <Sparkles size={80} style={{ marginBottom: 20 }} />
                <p style={{ fontSize: 20, fontFamily: 'Cormorant Garamond', fontWeight: 600 }}>Waiting to craft your journey...</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
