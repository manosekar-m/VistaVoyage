import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapPin, Clock, Calendar, Users, Trash2, XCircle } from "lucide-react";
import api from "../../utils/api";
import "./MyBookingsPage.css";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await api.get("/bookings/my");
      setBookings(data.bookings);
    } finally { setLoading(false); }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await api.put(`/bookings/${id}/cancel`);
      fetchBookings();
    } catch(err) { alert(err.response?.data?.message || "Error"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this booking from history?")) return;
    try {
      await api.delete(`/bookings/${id}`);
      setBookings(b => b.filter(x => x._id !== id));
    } catch(err) { alert(err.response?.data?.message || "Error"); }
  };

  return (
    <div className="my-bookings">
      <div className="container">
        <div className="page-header" style={{paddingTop:88}}>
          <h1>My Bookings</h1>
          <p>Track and manage all your travel bookings</p>
        </div>

        {loading ? (
          <div style={{textAlign:"center",padding:60}}><div className="spinner"/></div>
        ) : bookings.length === 0 ? (
          <div className="empty-state">
            <div style={{fontSize:"3.5rem"}}>🧳</div>
            <h3>No bookings yet</h3>
            <p>Start your journey by exploring our amazing travel packages!</p>
            <Link to="/packages" className="btn btn-primary">Explore Packages</Link>
          </div>
        ) : (
          <div className="bookings-list">
            {bookings.map(b => (
              <div key={b._id} className="booking-item">
                <div className="booking-item__img">
                  <img src={b.package?.images?.[0] || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300"} alt=""/>
                </div>
                <div className="booking-item__body">
                  <div className="booking-item__top">
                    <div>
                      <h3>{b.package?.title}</h3>
                      <p className="booking-item__id">Booking ID: {b.bookingId}</p>
                    </div>
                    <span className={`badge badge-${b.status.toLowerCase()}`}>{b.status}</span>
                  </div>
                  <div className="booking-item__meta">
                    <span><MapPin size={13}/> {b.package?.location}</span>
                    <span><Clock size={13}/> {b.package?.duration} Days</span>
                    <span><Calendar size={13}/> {new Date(b.travelDate).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</span>
                    <span><Users size={13}/> {b.persons} {b.persons>1?"Persons":"Person"}</span>
                  </div>
                  <div className="booking-item__footer">
                    <div className="booking-item__amount">
                      <span>Total Paid</span>
                      <strong>₹{b.totalAmount.toLocaleString()}</strong>
                    </div>
                    <div style={{display:"flex",gap:10}}>
                      {b.status === "Pending" && (
                        <button className="btn btn-outline btn-sm" onClick={() => handleCancel(b._id)}>
                          <XCircle size={14}/> Cancel
                        </button>
                      )}
                      {b.status === "Cancelled" && (
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(b._id)}>
                          <Trash2 size={14}/> Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
