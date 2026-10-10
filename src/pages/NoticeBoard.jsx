import React, { useState } from 'react';
import {
  Bell,
  Search,
  Calendar,
  User,
  Tag,
  PlusCircle,
  FileText,
  AlertCircle
} from 'lucide-react';

const CATEGORIES = ['All', 'Administrative', 'Facility', 'Maintenance', 'Mess Committee', 'Sports & Cultural'];

export default function NoticeBoard({ notices, onAddNotice }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // New notice form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Administrative');
  const [newDesc, setNewDesc] = useState('');
  const [newAuthor, setNewAuthor] = useState('Hostel Warden');
  const [formError, setFormError] = useState('');

  const handlePostNotice = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) {
      setFormError('Please fill in both title and description.');
      return;
    }

    const noticeObj = {
      id: `not-${Date.now()}`,
      title: newTitle.trim(),
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      category: newCategory,
      badge: 'New',
      author: newAuthor.trim() || 'Hostel Administration',
      description: newDesc.trim()
    };

    onAddNotice(noticeObj);
    setNewTitle('');
    setNewDesc('');
    setFormError('');
    setShowAddModal(false);
  };

  const filteredNotices = notices.filter((notice) => {
    const matchesCategory = selectedCategory === 'All' || notice.category === selectedCategory;
    const matchesSearch =
      notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Official Hostel Notice Board
          </h2>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
            Important circulars, maintenance schedules, and student committee announcements.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(!showAddModal)}
          className="btn btn-primary"
        >
          <PlusCircle size={18} />
          <span>Post Demo Notice</span>
        </button>
      </div>

      {/* Post Notice Form (Collapsible) */}
      {showAddModal && (
        <div className="card" style={{ marginBottom: '24px', borderColor: 'var(--primary)', background: '#fcfdff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Post a New Notice (Demo)</h3>
            <button
              onClick={() => setShowAddModal(false)}
              className="btn btn-sm btn-secondary"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handlePostNotice}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Notice Title *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Water Supply Schedule Revision"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                >
                  {CATEGORIES.filter(c => c !== 'All').map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Issuing Authority / Author</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Warden Office, Mess Committee, Sports Secretary"
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Notice Description *</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="Full details of the circular..."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
              />
            </div>

            {formError && (
              <div className="form-error" style={{ marginBottom: '14px' }}>
                <AlertCircle size={14} />
                <span>{formError}</span>
              </div>
            )}

            <button type="submit" className="btn btn-primary">
              Publish Notice
            </button>
          </form>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="filter-bar">
        <div className="filter-pills">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`filter-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="search-input-box">
          <Search size={16} className="search-icon-inside" />
          <input
            type="text"
            placeholder="Search circulars by keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Notices Grid */}
      {filteredNotices.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <FileText size={28} />
          </div>
          <div className="empty-title">No notices found</div>
          <p className="empty-desc">
            Try adjusting your search keywords or category filters.
          </p>
        </div>
      ) : (
        <div className="notices-grid">
          {filteredNotices.map((notice) => {
            const badgeTypeClass =
              notice.badge === 'Urgent'
                ? 'badge-lost'
                : notice.badge === 'Alert'
                ? 'badge-pending'
                : 'badge-primary';

            return (
              <div key={notice.id} className="notice-card">
                <div>
                  <div className="notice-top-meta">
                    <span className="badge badge-neutral">
                      <Tag size={12} /> {notice.category}
                    </span>
                    {notice.badge && (
                      <span className={`badge ${badgeTypeClass}`}>
                        {notice.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="notice-title">{notice.title}</h3>
                  <p className="notice-desc">{notice.description}</p>
                </div>

                <div className="notice-footer">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} color="var(--text-subtle)" />
                    <span>{notice.date}</span>
                    {notice.time && <span>• {notice.time}</span>}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 600, color: '#334155' }}>
                    <User size={13} color="var(--primary)" />
                    <span>{notice.author}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
