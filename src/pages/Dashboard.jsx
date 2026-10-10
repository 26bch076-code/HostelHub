import React from 'react';
import {
  AlertCircle,
  Clock,
  CheckCircle2,
  Bell,
  Utensils,
  Search,
  ArrowRight,
  ShieldAlert,
  Phone,
  Sparkles,
  Calendar
} from 'lucide-react';
import { HOSTEL_INFO, WEEKLY_MESS_MENU } from '../data/initialData';

export default function Dashboard({
  complaints,
  notices,
  onNavigate,
  currentUser
}) {
  const studentName = currentUser?.fullName || HOSTEL_INFO.studentName;
  const studentId = currentUser?.studentId || HOSTEL_INFO.rollNumber;
  const hostelName = currentUser?.hostel || HOSTEL_INFO.hostelName;
  const roomNumber = currentUser?.roomNumber || HOSTEL_INFO.roomNumber;

  // Compute counts
  const pendingCount = complaints.filter(c => c.status === 'Pending').length;
  const inProgressCount = complaints.filter(c => c.status === 'In Progress').length;
  const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;

  // Recent 3 complaints
  const recentComplaints = complaints.slice(0, 3);

  // Today's meal info (e.g. Saturday)
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = daysOfWeek[new Date().getDay()];
  const todayMenu = WEEKLY_MESS_MENU[todayName] || WEEKLY_MESS_MENU.Monday;

  // Format date
  const todayFormatted = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className="page-container">
      {/* 1. Welcome Hero Banner */}
      <div className="welcome-hero">
        <div className="welcome-text">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '1.2rem' }}>👋</span>
            <span style={{ fontSize: '0.85rem', color: '#a5b4fc', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Student Portal
            </span>
          </div>
          <h2>Namaste, {studentName}!</h2>
          <p>
            Welcome to {hostelName}. Here is what's happening around your block today.
          </p>

          <div className="welcome-tags">
            <div className="welcome-pill">
              <span>🏠</span> Room {roomNumber}
            </div>
            <div className="welcome-pill">
              <span>🎓</span> {studentId}
            </div>
            <div className="welcome-pill">
              <span>📶</span> Wi-Fi 6: Hostel Connected
            </div>
          </div>
        </div>

        <div className="welcome-date-box">
          <div className="welcome-date-day">{todayName}</div>
          <div className="welcome-date-sub">{todayFormatted}</div>
          <div style={{ marginTop: '8px', fontSize: '0.75rem', color: '#93c5fd', fontWeight: 600 }}>
            Curfew: 11:30 PM (Hackathon Special)
          </div>
        </div>
      </div>

      {/* 2. Top Announcement Banner */}
      {notices.length > 0 && (
        <div className="announcement-banner">
          <span className="announcement-badge">ANNOUNCEMENT</span>
          <div className="announcement-text" style={{ flex: 1 }}>
            <strong>{notices[0].title}:</strong> {notices[0].description.slice(0, 140)}...
          </div>
          <button
            onClick={() => onNavigate('notices')}
            className="btn btn-sm btn-secondary"
            style={{ fontSize: '0.76rem', whiteSpace: 'nowrap' }}
          >
            View Details
          </button>
        </div>
      )}

      {/* 3. Stat Counters Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'var(--warning-light)', color: 'var(--warning)' }}>
            <Clock size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Pending Complaints</span>
            <span className="stat-value" style={{ color: 'var(--warning-text)' }}>{pendingCount}</span>
            <span className="stat-subtext">Awaiting maintenance team</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'var(--info-light)', color: 'var(--info)' }}>
            <AlertCircle size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">In Progress</span>
            <span className="stat-value" style={{ color: 'var(--info)' }}>{inProgressCount}</span>
            <span className="stat-subtext">Technician assigned</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'var(--success-light)', color: 'var(--success)' }}>
            <CheckCircle2 size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Resolved Issues</span>
            <span className="stat-value" style={{ color: 'var(--success)' }}>{resolvedCount}</span>
            <span className="stat-subtext">Fixed and closed</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <Bell size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Active Notices</span>
            <span className="stat-value" style={{ color: 'var(--primary)' }}>{notices.length}</span>
            <span className="stat-subtext">Official circulars</span>
          </div>
        </div>
      </div>

      {/* 4. Quick-Access Cards */}
      <div className="quick-actions-section">
        <div className="section-title-wrap">
          <h3 className="section-title">
            <Sparkles size={20} color="var(--primary)" /> Quick Access
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Common Student Services</span>
        </div>

        <div className="quick-actions-grid">
          {/* Card: Complaints */}
          <div className="action-card" onClick={() => onNavigate('complaints')}>
            <div>
              <div className="action-card-top">
                <div className="action-card-icon" style={{ background: '#fef3c7', color: '#b45309' }}>
                  <AlertCircle size={24} />
                </div>
                <span className="badge badge-pending">{pendingCount} Active</span>
              </div>
              <div className="action-card-title">File / Track Complaint</div>
              <div className="action-card-desc">
                Electricity, water, washroom plumbing or room maintenance issues.
              </div>
            </div>
            <div className="action-card-footer">
              <span>Manage Complaints</span>
              <ArrowRight size={16} />
            </div>
          </div>

          {/* Card: Mess Menu */}
          <div className="action-card" onClick={() => onNavigate('mess')}>
            <div>
              <div className="action-card-top">
                <div className="action-card-icon" style={{ background: '#ecfdf5', color: '#047857' }}>
                  <Utensils size={24} />
                </div>
                <span className="badge badge-found">Today: {todayName}</span>
              </div>
              <div className="action-card-title">Today's Mess Menu</div>
              <div className="action-card-desc">
                Check breakfast, lunch, snacks, dinner timings and share meal feedback.
              </div>
            </div>
            <div className="action-card-footer">
              <span>View Full Menu</span>
              <ArrowRight size={16} />
            </div>
          </div>

          {/* Card: Notice Board */}
          <div className="action-card" onClick={() => onNavigate('notices')}>
            <div>
              <div className="action-card-top">
                <div className="action-card-icon" style={{ background: '#eef2ff', color: '#4338ca' }}>
                  <Bell size={24} />
                </div>
                <span className="badge badge-primary">Circulars</span>
              </div>
              <div className="action-card-title">Hostel Notice Board</div>
              <div className="action-card-desc">
                Official warden circulars, festival schedules, and maintenance alerts.
              </div>
            </div>
            <div className="action-card-footer">
              <span>Read Notices</span>
              <ArrowRight size={16} />
            </div>
          </div>

          {/* Card: Lost & Found */}
          <div className="action-card" onClick={() => onNavigate('lostfound')}>
            <div>
              <div className="action-card-top">
                <div className="action-card-icon" style={{ background: '#fef2f2', color: '#b91c1c' }}>
                  <Search size={24} />
                </div>
                <span className="badge badge-lost">Community</span>
              </div>
              <div className="action-card-title">Lost & Found Desk</div>
              <div className="action-card-desc">
                Found or misplaced keys, IDs, calculators, or earbuds around campus?
              </div>
            </div>
            <div className="action-card-footer">
              <span>Report or Claim</span>
              <ArrowRight size={16} />
            </div>
          </div>
        </div>
      </div>

      {/* 5. Two-Column Dashboard Split: Recent Complaints & Today's Meals */}
      <div className="dashboard-grid-split">
        {/* Left Column: Recent Complaints Summary */}
        <div className="card">
          <div className="section-title-wrap">
            <h3 className="section-title">
              <Clock size={19} color="var(--primary)" /> Recent Complaints Summary
            </h3>
            <button
              onClick={() => onNavigate('complaints')}
              className="btn btn-sm btn-outline"
            >
              View All
            </button>
          </div>

          {recentComplaints.length === 0 ? (
            <div className="empty-state">
              <p className="empty-desc">No complaints filed yet.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentComplaints.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: '14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)',
                    background: '#f8fafc',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="complaint-id">{item.id}</span>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                        {item.title}
                      </span>
                    </div>
                    <span
                      className={`badge ${
                        item.status === 'Resolved'
                          ? 'badge-resolved'
                          : item.status === 'In Progress'
                          ? 'badge-in-progress'
                          : 'badge-pending'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {item.description.slice(0, 95)}...
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--text-subtle)', marginTop: '4px' }}>
                    <span>Category: <strong>{item.category}</strong> • Room: <strong>{item.room}</strong></span>
                    <span>{item.createdAt}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Today's Meals & Emergency Contacts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Today's Mess Snapshot */}
          <div className="card" style={{ background: 'linear-gradient(180deg, #ffffff 0%, #fbfcfe 100%)' }}>
            <div className="section-title-wrap">
              <h3 className="section-title">
                <Utensils size={19} color="#059669" /> Today's Meal Snapshot
              </h3>
              <span className="badge badge-found">{todayName}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ padding: '10px 12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700 }}>
                  <span style={{ color: '#d97706' }}>🥣 Breakfast ({todayMenu.breakfast.timing})</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: '3px' }}>
                  {todayMenu.breakfast.items}
                </div>
              </div>

              <div style={{ padding: '10px 12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700 }}>
                  <span style={{ color: '#2563eb' }}>🍛 Lunch ({todayMenu.lunch.timing})</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: '3px' }}>
                  {todayMenu.lunch.items}
                </div>
              </div>

              <div style={{ padding: '10px 12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700 }}>
                  <span style={{ color: '#4f46e5' }}>🍲 Dinner ({todayMenu.dinner.timing})</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: '3px' }}>
                  {todayMenu.dinner.items}
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('mess')}
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', marginTop: '14px' }}
            >
              View 7-Day Schedule & Give Feedback
            </button>
          </div>

          {/* Emergency Helpline Box */}
          <div className="contacts-card">
            <div className="section-title-wrap" style={{ marginBottom: '12px' }}>
              <h3 className="section-title" style={{ fontSize: '1rem' }}>
                <ShieldAlert size={18} color="var(--danger)" /> Emergency Helplines
              </h3>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>24x7 Duty</span>
            </div>

            <div>
              {HOSTEL_INFO.emergencyContacts.slice(0, 3).map((contact, idx) => (
                <div key={idx} className="contact-item-row">
                  <div>
                    <div className="contact-role">{contact.role}</div>
                    <div className="contact-name">{contact.name}</div>
                  </div>
                  <div className="contact-phone">
                    {contact.phone}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
