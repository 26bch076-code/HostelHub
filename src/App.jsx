import React, { useState, useEffect } from 'react';
import { Menu, CheckCircle2, RotateCcw, LogOut, ShieldCheck, Sparkles } from 'lucide-react';
import Sidebar from './components/Sidebar';
import MobileBottomNav from './components/MobileBottomNav';
import DemoBanner from './components/DemoBanner';
import Dashboard from './pages/Dashboard';
import Complaints from './pages/Complaints';
import NoticeBoard from './pages/NoticeBoard';
import MessMenu from './pages/MessMenu';
import LostAndFound from './pages/LostAndFound';
import Login from './pages/Login';
import Register from './pages/Register';

import {
  getInitialSession,
  logoutStudent,
  onAuthStateChange
} from './services/authService';

import { isSupabaseConfigured } from './services/supabase';

import {
  getComplaints,
  saveComplaints,
  getNotices,
  saveNotices,
  getMessFeedback,
  saveMessFeedback,
  getLostFound,
  saveLostFound,
  resetAllData
} from './data/storage';

import {
  INITIAL_COMPLAINTS,
  INITIAL_NOTICES,
  INITIAL_MESS_FEEDBACK,
  INITIAL_LOST_FOUND
} from './data/initialData';

import './App.css';

export default function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authView, setAuthView] = useState('login'); // 'login' or 'register'

  // Application View State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toast, setToast] = useState('');

  // Persistent Domain States
  const [complaints, setComplaints] = useState(() => getComplaints());
  const [notices, setNotices] = useState(() => getNotices());
  const [messFeedback, setMessFeedback] = useState(() => getMessFeedback());
  const [lostFound, setLostFound] = useState(() => getLostFound());

  // Show a temporary toast banner
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => {
      setToast('');
    }, 3500);
  };

  // Initial Auth Session Check & Listener
  useEffect(() => {
    let isMounted = true;
    async function initAuth() {
      try {
        const sessionUser = await getInitialSession();
        if (isMounted) {
          setCurrentUser(sessionUser);
        }
      } catch (err) {
        console.warn('Auth check error:', err);
      } finally {
        if (isMounted) {
          setAuthLoading(false);
        }
      }
    }

    initAuth();

    const unsubscribe = onAuthStateChange((user) => {
      if (isMounted) {
        setCurrentUser(user);
      }
    });

    return () => {
      isMounted = false;
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Logout Handler
  const handleLogout = async () => {
    await logoutStudent();
    setCurrentUser(null);
    setAuthView('login');
    showToast('You have been signed out.');
  };

  // Login & Register Success Handlers
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setActiveTab('dashboard');
    showToast(`Welcome back, ${user.fullName}!`);
  };

  const handleRegisterSuccess = (user) => {
    setCurrentUser(user);
    setActiveTab('dashboard');
    showToast(`Account registered! Welcome to HostelHub, ${user.fullName}.`);
  };

  // 1. Complaint Handlers
  const handleAddComplaint = (newComplaint) => {
    const updated = [newComplaint, ...complaints];
    setComplaints(updated);
    saveComplaints(updated);
    showToast('Complaint registered successfully!');
  };

  const handleUpdateComplaintStatus = (id, newStatus) => {
    const updated = complaints.map((c) =>
      c.id === id ? { ...c, status: newStatus, updatedAt: 'Just now' } : c
    );
    setComplaints(updated);
    saveComplaints(updated);
    showToast(`Status updated to "${newStatus}"!`);
  };

  // 2. Notice Handlers
  const handleAddNotice = (newNotice) => {
    const updated = [newNotice, ...notices];
    setNotices(updated);
    saveNotices(updated);
    showToast('Notice published successfully!');
  };

  // 3. Mess Feedback Handlers
  const handleAddFeedback = (newFb) => {
    const updated = [newFb, ...messFeedback];
    setMessFeedback(updated);
    saveMessFeedback(updated);
    showToast('Mess review saved!');
  };

  // 4. Lost & Found Handlers
  const handleAddLostFound = (newItem) => {
    const updated = [newItem, ...lostFound];
    setLostFound(updated);
    saveLostFound(updated);
    showToast('Lost & Found item posted!');
  };

  const handleToggleClaimed = (id) => {
    const updated = lostFound.map((item) => {
      if (item.id === id) {
        const nextStatus = item.status === 'Claimed' ? 'Active' : 'Claimed';
        return { ...item, status: nextStatus };
      }
      return item;
    });
    setLostFound(updated);
    saveLostFound(updated);
    showToast('Item status updated!');
  };

  // 5. Reset to Demo Defaults
  const handleResetData = () => {
    if (window.confirm('Reset all demo complaints and items back to defaults?')) {
      resetAllData();
      setComplaints(INITIAL_COMPLAINTS);
      setNotices(INITIAL_NOTICES);
      setMessFeedback(INITIAL_MESS_FEEDBACK);
      setLostFound(INITIAL_LOST_FOUND);
      showToast('All data reset to initial demo values.');
    }
  };

  // Tab Header titles
  const pageTitles = {
    dashboard: { title: 'Hostel Dashboard', subtitle: 'Overview of complaints, daily mess meals, and announcements' },
    complaints: { title: 'Complaint Desk', subtitle: 'Submit maintenance requests and track resolution status' },
    notices: { title: 'Hostel Notice Board', subtitle: 'Official college circulars and community notices' },
    mess: { title: 'Daily Mess Menu', subtitle: '7-day hostel meal schedule and resident food reviews' },
    lostfound: { title: 'Lost & Found', subtitle: 'Community hub for misplaced and found hostel belongings' }
  };

  // 1. Loading State Screen
  if (authLoading) {
    return (
      <div className="auth-page-wrapper">
        <div style={{ textAlign: 'center', color: '#4f46e5', fontWeight: 600 }}>
          <div className="pulse-dot" style={{ width: 14, height: 14, margin: '0 auto 12px' }}></div>
          <span>Loading HostelHub...</span>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated Flows (Login or Register)
  if (!currentUser) {
    if (authView === 'register') {
      return (
        <>
          <Register
            onRegisterSuccess={handleRegisterSuccess}
            onNavigateLogin={() => setAuthView('login')}
          />
          {toast && (
            <div className="alert-toast">
              <CheckCircle2 size={18} color="var(--success)" />
              <span>{toast}</span>
            </div>
          )}
        </>
      );
    }

    return (
      <>
        <Login
          onLoginSuccess={handleLoginSuccess}
          onNavigateRegister={() => setAuthView('register')}
        />
        {toast && (
          <div className="alert-toast">
            <CheckCircle2 size={18} color="var(--success)" />
            <span>{toast}</span>
          </div>
        )}
      </>
    );
  }

  // 3. Authenticated Dashboard Layout
  return (
    <div className="app-container">
      {/* Desktop & Mobile Drawer Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        complaintsCount={complaints.filter(c => c.status === 'Pending').length}
        lostFoundCount={lostFound.filter(i => i.status === 'Active').length}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Content Pane */}
      <main className="main-content">
        {/* Top Demo Indicator Banner */}
        <DemoBanner onResetData={handleResetData} />

        {/* Top Header */}
        <header className="top-header">
          <div className="top-header-left">
            <button
              className="mobile-menu-toggle"
              onClick={() => setMobileOpen(true)}
              aria-label="Open Navigation Menu"
            >
              <Menu size={22} />
            </button>
            <div className="page-heading-group">
              <h1>{pageTitles[activeTab]?.title}</h1>
              <p>{pageTitles[activeTab]?.subtitle}</p>
            </div>
          </div>

          <div className="top-header-right">
            {/* Student profile chip in header */}
            <div className="header-user-badge">
              <div className="header-user-avatar">
                {currentUser.fullName.charAt(0).toUpperCase()}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {currentUser.fullName}
                </span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  Rm {currentUser.roomNumber}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="header-logout-btn"
                title="Log out of account"
                aria-label="Log Out"
              >
                <LogOut size={15} />
              </button>
            </div>

            <div className="header-status-pill">
              <span className="pulse-dot"></span>
              <span>
                {isSupabaseConfigured ? 'Supabase Live' : 'Hostel Block Live'}
              </span>
            </div>
          </div>
        </header>

        {/* Active View Renderer */}
        {activeTab === 'dashboard' && (
          <Dashboard
            complaints={complaints}
            notices={notices}
            onNavigate={setActiveTab}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'complaints' && (
          <Complaints
            complaints={complaints}
            onAddComplaint={handleAddComplaint}
            onUpdateStatus={handleUpdateComplaintStatus}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'notices' && (
          <NoticeBoard
            notices={notices}
            onAddNotice={handleAddNotice}
          />
        )}

        {activeTab === 'mess' && (
          <MessMenu
            messFeedback={messFeedback}
            onAddFeedback={handleAddFeedback}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'lostfound' && (
          <LostAndFound
            items={lostFound}
            onAddItem={handleAddLostFound}
            onToggleClaimed={handleToggleClaimed}
            currentUser={currentUser}
          />
        )}

        {/* Toast Notification */}
        {toast && (
          <div className="alert-toast">
            <CheckCircle2 size={18} color="var(--success)" />
            <span>{toast}</span>
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
