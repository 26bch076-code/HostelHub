import React, { useState } from 'react';
import {
  Search,
  PlusCircle,
  MapPin,
  Calendar,
  Phone,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Inbox
} from 'lucide-react';
import { HOSTEL_INFO } from '../data/initialData';

export default function LostAndFound({ items, onAddItem, onToggleClaimed, currentUser }) {
  // Filter state
  const [filterType, setFilterType] = useState('All'); // All, Lost, Found
  const [searchTerm, setSearchTerm] = useState('');

  const defaultContact = `${currentUser?.fullName || HOSTEL_INFO.studentName} (Room ${currentUser?.roomNumber || HOSTEL_INFO.roomNumber} • ${currentUser?.email || 'Student'})`;

  // Form state
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('Lost'); // Lost or Found
  const [location, setLocation] = useState('');
  const [contact, setContact] = useState(defaultContact);
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  React.useEffect(() => {
    if (currentUser) {
      setContact(`${currentUser.fullName || HOSTEL_INFO.studentName} (Room ${currentUser.roomNumber || HOSTEL_INFO.roomNumber} • ${currentUser.email || 'Student'})`);
    }
  }, [currentUser]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!itemName.trim()) {
      setFormError('Please provide an item name.');
      return;
    }
    if (!description.trim()) {
      setFormError('Please enter a description for the item.');
      return;
    }
    if (!contact.trim()) {
      setFormError('Please provide contact information so the student can reach you.');
      return;
    }

    setFormError('');

    const newItem = {
      id: `LF-${Date.now().toString().slice(-4)}`,
      title: itemName.trim(),
      category,
      location: location.trim() || 'Hostel Campus',
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      contact: contact.trim(),
      description: description.trim(),
      status: 'Active',
      badgeColor: category === 'Lost' ? 'rose' : 'emerald'
    };

    onAddItem(newItem);

    // Reset Form
    setItemName('');
    setLocation('');
    setDescription('');
    setSuccessMessage('Item report published! It is saved to your browser storage.');

    setTimeout(() => {
      setSuccessMessage('');
    }, 4500);
  };

  // Filtered Items
  const filteredItems = items.filter((item) => {
    const matchesCategory = filterType === 'All' || item.category === filterType;
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="page-container">
      {/* Page Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>
          Hostel Lost & Found Portal
        </h2>
        <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
          Report missing belongings or list found items to reunite them with their owners.
        </p>
      </div>

      <div className="lostfound-layout">
        {/* Left: Report Item Form */}
        <div className="card" style={{ height: 'fit-content' }}>
          <div style={{ marginBottom: '18px', paddingBottom: '12px', borderBottom: '1px solid var(--border-light)' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Report an Item
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Did you lose something or find unattended gear in the hostel?
            </p>
          </div>

          {successMessage && (
            <div
              style={{
                background: 'var(--success-light)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: 'var(--success-text)',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.82rem',
                fontWeight: 600,
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <CheckCircle2 size={16} />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Category: Lost or Found */}
            <div className="form-group">
              <label className="form-label">Report Type *</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setCategory('Lost')}
                  className={`btn ${category === 'Lost' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{
                    background: category === 'Lost' ? '#ef4444' : '#ffffff',
                    color: category === 'Lost' ? '#ffffff' : 'var(--text-main)',
                    borderColor: category === 'Lost' ? '#ef4444' : 'var(--border-light)',
                    padding: '8px 12px'
                  }}
                >
                  🔴 I Lost Something
                </button>
                <button
                  type="button"
                  onClick={() => setCategory('Found')}
                  className={`btn ${category === 'Found' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{
                    background: category === 'Found' ? '#10b981' : '#ffffff',
                    color: category === 'Found' ? '#ffffff' : 'var(--text-main)',
                    borderColor: category === 'Found' ? '#10b981' : 'var(--border-light)',
                    padding: '8px 12px'
                  }}
                >
                  🟢 I Found Something
                </button>
              </div>
            </div>

            {/* Item Name */}
            <div className="form-group">
              <label className="form-label">Item Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Casio Scientific Calculator, boAt Earphones"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
            </div>

            {/* Location */}
            <div className="form-group">
              <label className="form-label">
                <span>Location (Where lost or found)</span>
                <span className="optional">(Optional)</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., 2nd Floor Study Room, Mess Table #4"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            {/* Contact method */}
            <div className="form-group">
              <label className="form-label">Contact Method *</label>
              <input
                type="text"
                className="form-input"
                placeholder="Phone number, WhatsApp, or Room number"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">Description & Identification Details *</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="Color, brand, identifying marks, stickers, serial number hints..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {formError && (
              <div className="form-error" style={{ marginBottom: '14px' }}>
                <AlertCircle size={14} />
                <span>{formError}</span>
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              <PlusCircle size={18} />
              <span>Publish Item Notice</span>
            </button>
          </form>
        </div>

        {/* Right: Items Listing */}
        <div>
          {/* Filter Bar */}
          <div className="filter-bar">
            <div className="filter-pills">
              <button
                className={`filter-pill ${filterType === 'All' ? 'active' : ''}`}
                onClick={() => setFilterType('All')}
              >
                All Items ({items.length})
              </button>
              <button
                className={`filter-pill ${filterType === 'Lost' ? 'active' : ''}`}
                onClick={() => setFilterType('Lost')}
              >
                Lost ({items.filter(i => i.category === 'Lost').length})
              </button>
              <button
                className={`filter-pill ${filterType === 'Found' ? 'active' : ''}`}
                onClick={() => setFilterType('Found')}
              >
                Found ({items.filter(i => i.category === 'Found').length})
              </button>
            </div>

            <div className="search-input-box">
              <Search size={16} className="search-icon-inside" />
              <input
                type="text"
                placeholder="Search lost/found items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Items Grid */}
          {filteredItems.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <Inbox size={28} />
              </div>
              <div className="empty-title">No items found</div>
              <p className="empty-desc">
                No lost or found items match the current search filters.
              </p>
            </div>
          ) : (
            <div className="lostfound-grid">
              {filteredItems.map((item) => {
                const isClaimed = item.status === 'Claimed' || item.status === 'Resolved';
                const isLost = item.category === 'Lost';

                return (
                  <div
                    key={item.id}
                    className="lostfound-item-card"
                    style={{
                      opacity: isClaimed ? 0.75 : 1,
                      background: isClaimed ? '#f8fafc' : '#ffffff'
                    }}
                  >
                    <div>
                      <div className="lf-top-row">
                        <span
                          className={`badge ${
                            isClaimed
                              ? 'badge-neutral'
                              : isLost
                              ? 'badge-lost'
                              : 'badge-found'
                          }`}
                        >
                          {isClaimed ? 'RESOLVED / CLAIMED' : item.category.toUpperCase()}
                        </span>

                        <span style={{ fontSize: '0.74rem', color: 'var(--text-subtle)', fontFamily: 'var(--font-mono)' }}>
                          {item.id}
                        </span>
                      </div>

                      <h4 className="lf-title">{item.title}</h4>

                      <div className="lf-detail-row">
                        <MapPin size={14} color="var(--primary)" />
                        <span><strong>Location:</strong> {item.location}</span>
                      </div>

                      <div className="lf-detail-row">
                        <Calendar size={14} color="var(--text-subtle)" />
                        <span><strong>Reported:</strong> {item.date}</span>
                      </div>

                      <p className="lf-desc">{item.description}</p>
                    </div>

                    <div>
                      {/* Contact Box */}
                      <div className="lf-contact-box">
                        <Phone size={15} color="#4f46e5" />
                        <div>
                          <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                            Contact Person
                          </div>
                          <div style={{ fontWeight: 700, fontSize: '0.8rem' }}>
                            {item.contact}
                          </div>
                        </div>
                      </div>

                      {/* Interactive toggle claim button */}
                      <div className="lf-footer">
                        <span style={{ fontSize: '0.76rem', color: isClaimed ? 'var(--success)' : 'var(--text-muted)', fontWeight: 600 }}>
                          Status: {isClaimed ? '✓ Claimed' : '⏳ Open / Active'}
                        </span>

                        <button
                          type="button"
                          onClick={() => onToggleClaimed(item.id)}
                          className="btn btn-sm btn-secondary"
                          style={{ fontSize: '0.75rem' }}
                          title="Demo action: toggle between open and claimed"
                        >
                          {isClaimed ? 'Mark as Open' : 'Mark as Claimed'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
