import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState(user || { name: '', email: '', phone: '' });

  const handleSave = () => {
    console.log('Profile updated:', profile);
    setEditing(false);
    alert('Profile updated successfully!');
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>My Profile</h2>
        <button onClick={() => setEditing(!editing)} style={{ padding: '8px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          {editing ? 'Cancel' : 'Edit'}
        </button>
      </div>
      {editing ? (
        <div>
          <input type="text" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} style={{ width: '100%', padding: '8px', marginBottom: '10px' }} />
          <input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} style={{ width: '100%', padding: '8px', marginBottom: '10px' }} />
          <input type="tel" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} style={{ width: '100%', padding: '8px', marginBottom: '10px' }} />
          <button onClick={handleSave} style={{ width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Save Changes</button>
        </div>
      ) : (
        <div>
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Phone:</strong> {profile.phone}</p>
        </div>
      )}
    </div>
  );
}
