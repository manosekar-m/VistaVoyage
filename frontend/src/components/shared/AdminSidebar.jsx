import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard, CalendarCheck, Package, Users,
  MessageSquare, HelpCircle, UserCircle, LogOut, Globe, Menu, X
} from "lucide-react";
import "./AdminSidebar.css";

const NAV = [
  { path: "/admin",           label: "Dashboard",   icon: <LayoutDashboard size={18}/> },
  { path: "/admin/bookings",  label: "Bookings",    icon: <CalendarCheck   size={18}/> },
  { path: "/admin/packages",  label: "Packages",    icon: <Package         size={18}/> },
  { path: "/admin/users",     label: "Users",       icon: <Users           size={18}/> },
  { path: "/admin/feedback",  label: "Feedback",    icon: <MessageSquare   size={18}/> },
  { path: "/admin/queries",   label: "Queries",     icon: <HelpCircle      size={18}/> },
  { path: "/admin/profile",   label: "Profile",     icon: <UserCircle      size={18}/> },
];

export default function AdminSidebar() {
  const { logout, admin } = useAuth();
  const location   = useLocation();
  const navigate   = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); navigate("/admin/login"); };

  return (
    <>
      <button className="sidebar__mobile-toggle" onClick={() => setOpen(o => !o)}>
        {open ? <X size={22}/> : <Menu size={22}/>}
      </button>
      <aside className={`admin-sidebar ${open ? "admin-sidebar--open" : ""}`}>
        <div className="admin-sidebar__logo">
          <Globe size={20}/>
          <span>Vista<strong>Voyage</strong></span>
        </div>
        <div className="admin-sidebar__admin">
          <div className="admin-sidebar__avatar">{admin?.name?.charAt(0) || "A"}</div>
          <div>
            <div className="admin-sidebar__name">{admin?.name || "Admin"}</div>
            <div className="admin-sidebar__role">Administrator</div>
          </div>
        </div>
        <nav className="admin-sidebar__nav">
          {NAV.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-sidebar__link ${location.pathname === item.path ? "admin-sidebar__link--active" : ""}`}
              onClick={() => setOpen(false)}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <button className="admin-sidebar__logout" onClick={handleLogout}>
          <LogOut size={18}/> Logout
        </button>
      </aside>
      {open && <div className="sidebar__overlay" onClick={() => setOpen(false)}/>}
    </>
  );
}
