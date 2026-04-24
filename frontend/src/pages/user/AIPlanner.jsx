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
    <div style={{ paddingTop: 100, minHeight: '100vh', background: 'var(--bg-page)', paddingBottom: 100 }}>
      <div className="container" style={{ maxWidth: 1000 }}>
        
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(201,168,76,0.1)', padding: '8px 20px', borderRadius: 40, color: 'var(--accent)', fontWeight: 700, fontSize: 14, marginBottom: 20 }}>
            <Sparkles size={16} />
            Powered by VistaVoyage AI
          </div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '3.5rem', color: 'var(--text-main)', marginBottom: 16 }}>AI Travel Architect</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 18, maxWidth: 600, margin: '0 auto' }}>
            Describe your dream escape and let our intelligent architect craft a bespoke journey just for you.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: result ? '350px 1fr' : '1fr', gap: 40, transition: 'all 0.5s ease' }}>
          
          {/* Form Section */}
          <div style={{ background: 'var(--bg-card)', borderRadius: 24, padding: 32, border: '1px solid var(--border-color)', boxShadow: 'var(--shadow)', height: 'fit-content' }}>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 12 }}>
                  <MapPin size={14} /> Destination
                </label>
                <input 
                  required
                  className="form-input" 
                  placeholder="e.g. Switzerland, Bali, Kerala"
                  value={formData.destination}
                  onChange={e => setFormData({...formData, destination: e.target.value})}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 12 }}>
                    <Calendar size={14} /> Duration
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
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 12 }}>
                    <Users size={14} /> Travelers
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

              <div style={{ marginBottom: 32 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 12 }}>
                  <Info size={14} /> Preferences
                </label>
                <textarea 
                  className="form-input" 
                  style={{ minHeight: 100, padding: 15, resize: 'none' }}
                  placeholder="e.g. Adventure-focused, hidden gems, kid-friendly, luxury stays..."
                  value={formData.preferences}
                  onChange={e => setFormData({...formData, preferences: e.target.value})}
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                style={{ width: '100%', padding: 16, background: 'var(--accent)', color: 'var(--primary-navy)', border: 'none', borderRadius: 12, fontWeight: 800, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
              >
                {loading ? <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : <><Sparkles size={18} /> Craft My Journey</>}
              </button>
            </form>
          </div>

          {/* Result Section */}
          {result && (
            <div style={{ animation: 'fadeIn 0.8s ease' }}>
              <div style={{ background: 'var(--bg-card)', borderRadius: 24, padding: 40, border: '1px solid var(--border-color)', boxShadow: 'var(--shadow)', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
                  <div>
                    <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', color: 'var(--text-main)', marginBottom: 8 }}>{result.title}</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: 16, fontStyle: 'italic' }}>{result.summary}</p>
                  </div>
                  <button 
                    onClick={savePDF}
                    style={{ background: 'var(--gray-100)', color: 'var(--text-main)', border: 'none', padding: '10px 16px', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontWeight: 600 }}
                  >
                    <Download size={16} /> Save PDF
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  {result.itinerary.map((day, idx) => (
                    <div key={idx} style={{ padding: 24, background: 'var(--bg-page)', borderRadius: 20, border: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--accent)', color: 'var(--primary-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>{day.day}</div>
                        <h3 style={{ fontSize: 18, color: 'var(--text-main)', fontWeight: 700 }}>{day.title}</h3>
                      </div>
                      <ul style={{ paddingLeft: 52, margin: 0 }}>
                        {day.activities.map((act, i) => (
                          <li key={i} style={{ color: 'var(--text-muted)', fontSize: 15, marginBottom: 8, lineHeight: 1.6 }}>{act}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 40, padding: 24, background: 'rgba(201,168,76,0.05)', borderRadius: 20, border: '1px dashed var(--accent)' }}>
                  <h4 style={{ color: 'var(--accent)', fontSize: 14, fontWeight: 800, textTransform: 'uppercase', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}><Info size={16} /> Architect's Tips</h4>
                  <p style={{ color: 'var(--text-main)', fontSize: 15, lineHeight: 1.6, margin: 0 }}>{result.travelTips}</p>
                </div>
              </div>
            </div>
          )}

          {!result && !loading && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.3 }}>
              <div style={{ textAlign: 'center' }}>
                <Sparkles size={100} style={{ marginBottom: 20 }} />
                <p style={{ fontSize: 24, fontFamily: 'Cormorant Garamond' }}>Waiting to craft your magic...</p>
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
