import React, { useState } from 'react';
import {
  AlertCircle,
  PlusCircle,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
  MapPin,
  Calendar,
  AlertTriangle,
  RotateCw,
  Cpu,
  Check
} from 'lucide-react';
import { HOSTEL_INFO } from '../data/initialData';
import { requestComplaintCategorization } from '../services/aiService';

export const COMPLAINT_CATEGORIES = [
  'Electrical',
  'Water and Plumbing',
  'Mess and Food',
  'Cleanliness',
  'Maintenance',
  'Internet and Wi-Fi',
  'Security',
  'Other'
];

const STATUSES = ['All', 'Pending', 'In Progress', 'Resolved'];

export default function Complaints({ complaints, onAddComplaint, onUpdateStatus, currentUser }) {
  // Form state
  const defaultRoom = currentUser?.roomNumber || HOSTEL_INFO.roomNumber;
  const studentName = currentUser?.fullName || HOSTEL_INFO.studentName;

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Electrical');
  const [description, setDescription] = useState('');
  const [room, setRoom] = useState(defaultRoom);
  const [urgency, setUrgency] = useState('Normal');
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // AI Feature 1 State: Auto-Categorization
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [aiNotice, setAiNotice] = useState(null); // { type: 'warning' | 'error' | 'success', text: string }

  // Update room default if user changes
  React.useEffect(() => {
    if (currentUser?.roomNumber) {
      setRoom(currentUser.roomNumber);
    }
  }, [currentUser]);

  // Filter state
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Trigger Gemma AI Categorization
  const handleAutoCategorize = async () => {
    if (!description.trim()) {
      setFormError('Please type a description of the issue first so Gemma can analyze it.');
      return;
    }

    setFormError('');
    setAiLoading(true);
    setAiNotice(null);

    try {
      const res = await requestComplaintCategorization(description);

      if (res.success && res.data) {
        setAiSuggestion(res.data);
        setAiNotice({
          type: 'success',
          text: `Gemma suggests: ${res.data.category} (${res.data.priority} Priority)`
        });
      } else if (res.configured === false) {
        setAiNotice({
          type: 'warning',
          text: 'Gemma AI is not configured. Add GEMMA_API_KEY or GROQ_API_KEY to your .env file to enable live AI categorization.'
        });
      } else {
        setAiNotice({
          type: 'error',
          text: res.message || 'AI categorization could not be completed.'
        });
      }
    } catch (err) {
      setAiNotice({
        type: 'error',
        text: err.message || 'Failed to reach AI service.'
      });
    } finally {
      setAiLoading(false);
    }
  };

  // Apply suggestions to form (User can review and edit before submission)
  const handleApplyAISuggestions = () => {
    if (!aiSuggestion) return;

    if (aiSuggestion.category && COMPLAINT_CATEGORIES.includes(aiSuggestion.category)) {
      setCategory(aiSuggestion.category);
    }
    if (aiSuggestion.summary) {
      setTitle(aiSuggestion.summary);
    }
    if (aiSuggestion.location) {
      setRoom(aiSuggestion.location);
    }
    if (aiSuggestion.priority) {
      setUrgency(aiSuggestion.priority);
    }

    setAiSuggestion(null);
    setAiNotice({
      type: 'success',
      text: 'AI suggestions applied! You can freely review and edit any field before submitting.'
    });

    setTimeout(() => {
      setAiNotice(null);
    }, 4500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic Validation
    if (!title.trim()) {
      setFormError('Please enter a brief title for your complaint.');
      return;
    }
    if (!description.trim()) {
      setFormError('Please describe the issue in detail.');
      return;
    }

    setFormError('');

    const newComplaint = {
      id: `CMP-${Math.floor(100 + Math.random() * 900)}`,
      title: title.trim(),
      category,
      room: room.trim() || defaultRoom,
      description: description.trim(),
      status: 'Pending',
      urgency,
      studentName: studentName,
      studentId: currentUser?.studentId || HOSTEL_INFO.rollNumber,
      createdAt: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }) + ', ' + new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      updatedAt: 'Just now',
      adminRemarks: 'Logged in system. Awaiting technician assignment.'
    };

    onAddComplaint(newComplaint);

    // Reset Form
    setTitle('');
    setDescription('');
    setUrgency('Normal');
    setAiSuggestion(null);
    setAiNotice(null);
    setSuccessMessage('Complaint registered successfully! It is saved to your browser storage.');

    setTimeout(() => {
      setSuccessMessage('');
    }, 4500);
  };

  // Filter logic (support both new categories and legacy seed categories)
  const filteredComplaints = complaints.filter((item) => {
    const matchesStatus = selectedStatus === 'All' || item.status === selectedStatus;
    const matchesCategory =
      selectedCategory === 'All' ||
      item.category === selectedCategory ||
      (selectedCategory === 'Electrical' && item.category === 'Electricity') ||
      (selectedCategory === 'Water and Plumbing' && (item.category === 'Water' || item.category === 'Plumbing')) ||
      (selectedCategory === 'Cleanliness' && item.category === 'Cleaning');

    return matchesStatus && matchesCategory;
  });

  return (
    <div className="page-container">
      {/* Page Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>
          Hostel Complaint Management
        </h2>
        <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
          Report maintenance issues. Use Google Gemma AI to auto-categorize and prioritize your complaints.
        </p>
      </div>

      <div className="complaints-layout">
        {/* Left Side: Submit Complaint Form */}
        <div className="card complaint-form-card">
          <div className="complaint-form-header">
            <h3>Register New Complaint</h3>
            <p>Your issue will be logged with the hostel caretaker.</p>
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
            {/* Description (With AI Categorize Trigger) */}
            <div className="form-group">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label className="form-label" style={{ marginBottom: 0 }}>
                  Detailed Description *
                </label>
                <button
                  type="button"
                  onClick={handleAutoCategorize}
                  disabled={aiLoading || !description.trim()}
                  className="ai-trigger-btn"
                  title="Use Google Gemma to analyze complaint and suggest category, summary, location, and priority"
                >
                  {aiLoading ? (
                    <>
                      <RotateCw size={12} className="spin" />
                      <span>Gemma Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={12} color="#4f46e5" />
                      <span>Auto-Categorize with Gemma</span>
                    </>
                  )}
                </button>
              </div>

              <textarea
                className="form-textarea"
                rows={3}
                placeholder="Describe what is wrong, exact location, when it started... (e.g. 'Ceiling fan in room 304 stopped spinning and made sparks')"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* AI Warning / Unconfigured Banner */}
            {aiNotice && aiNotice.type === 'warning' && (
              <div className="ai-warning-box">
                <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>AI Unconfigured:</strong> {aiNotice.text}
                </div>
              </div>
            )}

            {/* AI Error Banner */}
            {aiNotice && aiNotice.type === 'error' && (
              <div className="auth-error-box" style={{ fontSize: '0.78rem', marginBottom: '12px' }}>
                <AlertCircle size={15} />
                <span>{aiNotice.text}</span>
              </div>
            )}

            {/* AI Suggestion Review Box */}
            {aiSuggestion && (
              <div className="ai-suggestion-box">
                <div className="ai-suggestion-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Cpu size={15} color="#4f46e5" />
                    <span className="ai-model-tag">Gemma 2 AI</span>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      Suggestions Ready
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAiSuggestion(null)}
                    style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    Dismiss
                  </button>
                </div>

                <div className="ai-suggestion-body">
                  <div className="ai-suggestion-row">
                    <span className="ai-label">Suggested Category:</span>
                    <span className="badge badge-primary">{aiSuggestion.category}</span>
                  </div>

                  <div className="ai-suggestion-row">
                    <span className="ai-label">Suggested Title:</span>
                    <span style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-main)' }}>
                      {aiSuggestion.summary}
                    </span>
                  </div>

                  {aiSuggestion.location && (
                    <div className="ai-suggestion-row">
                      <span className="ai-label">Detected Location:</span>
                      <span style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--primary)' }}>
                        📍 {aiSuggestion.location}
                      </span>
                    </div>
                  )}

                  <div className="ai-suggestion-row">
                    <span className="ai-label">Suggested Priority:</span>
                    <span
                      className={`badge ${
                        aiSuggestion.priority === 'Urgent'
                          ? 'badge-lost'
                          : aiSuggestion.priority === 'High'
                          ? 'badge-pending'
                          : 'badge-resolved'
                      }`}
                    >
                      {aiSuggestion.priority} Priority
                    </span>
                  </div>

                  {aiSuggestion.reasoning && (
                    <p className="ai-reasoning-text">
                      💡 <em>{aiSuggestion.reasoning}</em>
                    </p>
                  )}
                </div>

                <div className="ai-suggestion-actions">
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={handleApplyAISuggestions}
                    style={{ width: '100%', fontSize: '0.8rem', gap: '6px' }}
                  >
                    <Check size={14} />
                    <span>Apply Suggestions to Form</span>
                  </button>
                </div>

                <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', textAlign: 'center', marginTop: '6px' }}>
                  You can review and edit all fields below before submitting.
                </div>
              </div>
            )}

            {/* Category */}
            <div className="form-group">
              <label className="form-label">
                Complaint Category *
              </label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {COMPLAINT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Title / Summary */}
            <div className="form-group">
              <label className="form-label">
                Subject / Title *
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Geyser not heating, Tubelight flickering"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Room Number (Optional) */}
            <div className="form-group">
              <label className="form-label">
                <span>Room / Area</span>
                <span className="optional">(Optional)</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., 304, Block B 3rd Floor East"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
              />
            </div>

            {/* Urgency */}
            <div className="form-group">
              <label className="form-label">
                Urgency Priority
              </label>
              <select
                className="form-select"
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
              >
                <option value="Normal">Normal (Within 24-48 hrs)</option>
                <option value="High">High (Within 12 hrs)</option>
                <option value="Urgent">Emergency (Immediate)</option>
              </select>
            </div>

            {formError && (
              <div className="form-error" style={{ marginBottom: '14px' }}>
                <AlertCircle size={14} />
                <span>{formError}</span>
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              <PlusCircle size={18} />
              <span>Submit Complaint</span>
            </button>
          </form>
        </div>

        {/* Right Side: Complaint Feed & Filters */}
        <div>
          {/* Status and Category Filter Bar */}
          <div className="filter-bar">
            {/* Status pills */}
            <div className="filter-pills">
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginRight: '4px' }}>
                Status:
              </span>
              {STATUSES.map((st) => (
                <button
                  key={st}
                  className={`filter-pill ${selectedStatus === st ? 'active' : ''}`}
                  onClick={() => setSelectedStatus(st)}
                >
                  {st}
                  {st !== 'All' && (
                    <span style={{ marginLeft: '4px', opacity: 0.85 }}>
                      ({complaints.filter(c => c.status === st).length})
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Category dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                Category:
              </span>
              <select
                className="form-select"
                style={{ width: 'auto', padding: '6px 12px', fontSize: '0.8rem' }}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="All">All Categories</option>
                {COMPLAINT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Complaints List */}
          {filteredComplaints.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <CheckCircle2 size={28} />
              </div>
              <div className="empty-title">No complaints found</div>
              <p className="empty-desc">
                There are no complaints matching the selected filter criteria.
              </p>
            </div>
          ) : (
            <div className="complaints-list">
              {filteredComplaints.map((item) => {
                const statusBadgeClass =
                  item.status === 'Resolved'
                    ? 'badge-resolved'
                    : item.status === 'In Progress'
                    ? 'badge-in-progress'
                    : 'badge-pending';

                return (
                  <div key={item.id} className="complaint-item-card">
                    {/* Header */}
                    <div className="complaint-header-row">
                      <div className="complaint-title-group">
                        <span className="complaint-id">{item.id}</span>
                        <h4 className="complaint-title">{item.title}</h4>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className={`badge ${statusBadgeClass}`}>
                          {item.status}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="complaint-desc">{item.description}</p>

                    {/* Admin remark note if present */}
                    {item.adminRemarks && (
                      <div
                        style={{
                          background: '#f8fafc',
                          borderLeft: '3px solid var(--primary)',
                          padding: '8px 12px',
                          borderRadius: '0 6px 6px 0',
                          fontSize: '0.8rem',
                          color: '#475569',
                          marginBottom: '12px'
                        }}
                      >
                        <strong>Maintenance Note:</strong> {item.adminRemarks}
                      </div>
                    )}

                    {/* Meta info & Demo Status Changer */}
                    <div className="complaint-meta-row">
                      <div className="complaint-meta-items">
                        <span className="meta-chip">
                          <MapPin size={14} color="var(--primary)" />
                          <span>Room: {item.room}</span>
                        </span>
                        <span className="meta-chip">
                          <Filter size={14} />
                          <span>Category: {item.category}</span>
                        </span>
                        <span className="meta-chip">
                          <Calendar size={14} />
                          <span>Filed: {item.createdAt}</span>
                        </span>
                        {item.urgency === 'High' || item.urgency === 'Urgent' ? (
                          <span className="badge badge-lost" style={{ fontSize: '0.68rem', padding: '2px 6px' }}>
                            {item.urgency} Priority
                          </span>
                        ) : null}
                      </div>

                      {/* Interactive demo status updater */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          Demo update:
                        </span>
                        <select
                          className="status-changer-select"
                          value={item.status}
                          onChange={(e) => onUpdateStatus(item.id, e.target.value)}
                          title="Demo action: Change complaint status"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
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
