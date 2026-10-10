import React from 'react';
import {
  LayoutDashboard,
  AlertCircle,
  Bell,
  Utensils,
  Search,
  Building2,
  X,
  LogOut
} from 'lucide-react';
import { HOSTEL_INFO } from '../data/initialData';

export default function Sidebar({
  activeTab,
  setActiveTab,
  mobileOpen,
  setMobileOpen,
  complaintsCount,
  lostFoundCount,
  currentUser,
  onLogout
}) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'complaints', label: 'Complaints', icon: AlertCircle, counter: complaintsCount },
    { id: 'notices', label: 'Notice Board', icon: Bell },
    { id: 'mess', label: 'Mess Menu', icon: Utensils },
    { id: 'lostfound', label: 'Lost & Found', icon: Search, counter: lostFoundCount }
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    if (setMobileOpen) {
      setMobileOpen(false);
    }
  };

  const studentName = currentUser?.fullName || HOSTEL_INFO.studentName;
  const studentId = currentUser?.studentId || HOSTEL_INFO.rollNumber;
  const hostelName = currentUser?.hostel || HOSTEL_INFO.hostelName;
  const roomNumber = currentUser?.roomNumber || HOSTEL_INFO.roomNumber;

  return (
    <>
      {/* Backdrop for mobile */}
      {mobileOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        {/* Header & Branding */}
        <div className="sidebar-header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="brand-wrapper">
              <div className="brand-logo-icon">
                <Building2 size={22} strokeWidth={2.4} />
              </div>
              <div>
                <div className="brand-title">HostelHub</div>
                <div className="brand-subtitle">Smart Student Living</div>
              </div>
            </div>

            {/* Close button on mobile */}
            {mobileOpen && (
              <button
                style={{ color: '#94a3b8', padding: '6px' }}
                onClick={() => setMobileOpen(false)}
                aria-label="Close sidebar"
              >
                <X size={20} />
              </button>
            )}
          </div>

          <div className="hostel-badge-box">
            <div className="hostel-name">
              <span>🏛️</span> {hostelName}
            </div>
            <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
              <span className="room-badge">Room {roomNumber}</span>
              <span className="room-badge" style={{ background: 'rgba(245, 158, 11, 0.25)', color: '#fde68a' }}>
                Resident
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <div className="nav-label-group">
                  <Icon size={19} strokeWidth={isActive ? 2.5 : 2} />
                  <span>{item.label}</span>
                </div>
                {item.counter !== undefined && item.counter > 0 && (
                  <span className="nav-counter">{item.counter}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Student Profile Card & Logout in Footer */}
        <div className="sidebar-footer">
          <div className="student-card">
            <div className="student-avatar">
              {studentName.charAt(0).toUpperCase()}
            </div>
            <div className="student-details">
              <div className="student-name">{studentName}</div>
              <div className="student-sub">{studentId}</div>
            </div>
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              className="logout-btn-sidebar"
              title="Sign out of student account"
            >
              <LogOut size={13} />
              <span>Log Out</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
