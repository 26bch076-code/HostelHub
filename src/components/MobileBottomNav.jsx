import React from 'react';
import {
  LayoutDashboard,
  AlertCircle,
  Bell,
  Utensils,
  Search
} from 'lucide-react';

export default function MobileBottomNav({ activeTab, setActiveTab }) {
  const items = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'complaints', label: 'Issues', icon: AlertCircle },
    { id: 'notices', label: 'Notices', icon: Bell },
    { id: 'mess', label: 'Mess', icon: Utensils },
    { id: 'lostfound', label: 'Lost', icon: Search }
  ];

  return (
    <nav className="mobile-bottom-nav">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`mobile-nav-btn ${isActive ? 'active' : ''}`}
            aria-label={item.label}
          >
            <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
