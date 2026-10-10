import React, { useState } from 'react';
import {
  Utensils,
  Coffee,
  Sun,
  Sunset,
  Moon,
  Star,
  Send,
  Sparkles,
  MessageSquare,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { WEEKLY_MESS_MENU, HOSTEL_INFO } from '../data/initialData';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function MessMenu({ messFeedback, onAddFeedback, currentUser }) {
  // Current day defaults
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = daysOfWeek[new Date().getDay()];

  const [selectedDay, setSelectedDay] = useState(todayName);

  // Feedback form state
  const [mealType, setMealType] = useState('Lunch');
  const [rating, setRating] = useState(5);
  const [studentName, setStudentName] = useState(currentUser?.fullName || HOSTEL_INFO.studentName);
  const [room, setRoom] = useState(currentUser?.roomNumber || HOSTEL_INFO.roomNumber);
  const [comment, setComment] = useState('');
  const [feedbackError, setFeedbackError] = useState('');
  const [feedbackSuccess, setFeedbackSuccess] = useState('');

  React.useEffect(() => {
    if (currentUser?.fullName) {
      setStudentName(currentUser.fullName);
    }
    if (currentUser?.roomNumber) {
      setRoom(currentUser.roomNumber);
    }
  }, [currentUser]);

  const currentMenu = WEEKLY_MESS_MENU[selectedDay] || WEEKLY_MESS_MENU.Monday;

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setFeedbackError('Please share your thoughts or suggestions in the comments.');
      return;
    }

    setFeedbackError('');

    const newFeedback = {
      id: `fb-${Date.now()}`,
      mealType,
      day: selectedDay,
      rating,
      studentName: studentName.trim() || 'Anonymous Resident',
      room: room.trim() || HOSTEL_INFO.roomNumber,
      comment: comment.trim(),
      date: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }) + ', ' + new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    };

    onAddFeedback(newFeedback);
    setComment('');
    setFeedbackSuccess('Thank you! Your mess review has been logged to local storage.');

    setTimeout(() => {
      setFeedbackSuccess('');
    }, 4000);
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>
          Weekly Hostel Mess Menu & Feedback
        </h2>
        <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
          View four daily meals prepared by the hostel mess contractor. Submit real reviews to improve food quality.
        </p>
      </div>

      {/* Day Selector Pills */}
      <div className="day-selector-strip">
        {DAYS.map((day) => {
          const isToday = day === todayName;
          const isSelected = selectedDay === day;
          return (
            <button
              key={day}
              className={`day-tab-btn ${isSelected ? 'active' : ''}`}
              onClick={() => setSelectedDay(day)}
            >
              <span>{day}</span>
              {isToday && (
                <span style={{ marginLeft: '6px', fontSize: '0.68rem', opacity: 0.9 }}>
                  (Today)
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 4 Meals Grid: Breakfast, Lunch, Evening Snacks, Dinner */}
      <div className="meals-grid">
        {/* 1. Breakfast */}
        <div className="meal-card">
          <div className="meal-card-header">
            <div className="meal-title-group">
              <div className="meal-badge-icon" style={{ background: '#fef3c7', color: '#b45309' }}>
                <Coffee size={20} />
              </div>
              <div>
                <h4 className="meal-name">Breakfast</h4>
                <span className="meal-time">{currentMenu.breakfast.timing}</span>
              </div>
            </div>
            <span className="badge badge-pending">Morning</span>
          </div>

          <div className="meal-card-body">
            <p className="meal-dishes-text">
              {currentMenu.breakfast.items}
            </p>
            {currentMenu.breakfast.special && (
              <div className="meal-special-badge">
                <Sparkles size={14} />
                <span>Special: {currentMenu.breakfast.special}</span>
              </div>
            )}
          </div>
        </div>

        {/* 2. Lunch */}
        <div className="meal-card">
          <div className="meal-card-header">
            <div className="meal-title-group">
              <div className="meal-badge-icon" style={{ background: '#e0f2fe', color: '#0369a1' }}>
                <Sun size={20} />
              </div>
              <div>
                <h4 className="meal-name">Lunch</h4>
                <span className="meal-time">{currentMenu.lunch.timing}</span>
              </div>
            </div>
            <span className="badge badge-in-progress">Afternoon</span>
          </div>

          <div className="meal-card-body">
            <p className="meal-dishes-text">
              {currentMenu.lunch.items}
            </p>
            {currentMenu.lunch.special && (
              <div className="meal-special-badge" style={{ background: '#e0f2fe', color: '#075985', borderColor: '#bae6fd' }}>
                <Sparkles size={14} />
                <span>Special: {currentMenu.lunch.special}</span>
              </div>
            )}
          </div>
        </div>

        {/* 3. Evening Snacks */}
        <div className="meal-card">
          <div className="meal-card-header">
            <div className="meal-title-group">
              <div className="meal-badge-icon" style={{ background: '#ffedd5', color: '#c2410c' }}>
                <Sunset size={20} />
              </div>
              <div>
                <h4 className="meal-name">Evening Snacks</h4>
                <span className="meal-time">{currentMenu.snacks.timing}</span>
              </div>
            </div>
            <span className="badge" style={{ background: '#fff7ed', color: '#c2410c', border: '1px solid #ffedd5' }}>
              High Tea
            </span>
          </div>

          <div className="meal-card-body">
            <p className="meal-dishes-text">
              {currentMenu.snacks.items}
            </p>
            {currentMenu.snacks.special && (
              <div className="meal-special-badge" style={{ background: '#ffedd5', color: '#9a3412', borderColor: '#fed7aa' }}>
                <Sparkles size={14} />
                <span>Special: {currentMenu.snacks.special}</span>
              </div>
            )}
          </div>
        </div>

        {/* 4. Dinner */}
        <div className="meal-card">
          <div className="meal-card-header">
            <div className="meal-title-group">
              <div className="meal-badge-icon" style={{ background: '#eef2ff', color: '#4338ca' }}>
                <Moon size={20} />
              </div>
              <div>
                <h4 className="meal-name">Dinner</h4>
                <span className="meal-time">{currentMenu.dinner.timing}</span>
              </div>
            </div>
            <span className="badge badge-primary">Night</span>
          </div>

          <div className="meal-card-body">
            <p className="meal-dishes-text">
              {currentMenu.dinner.items}
            </p>
            {currentMenu.dinner.special && (
              <div className="meal-special-badge" style={{ background: '#eef2ff', color: '#3730a3', borderColor: '#c7d2fe' }}>
                <Sparkles size={14} />
                <span>Special: {currentMenu.dinner.special}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mess Feedback Split: Form on Left, Reviews on Right */}
      <div className="mess-feedback-section">
        {/* Form Card */}
        <div className="card">
          <div style={{ marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--border-light)' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Mess Quality Feedback Form
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Rate today's meals to help the student mess committee evaluate caterer standards.
            </p>
          </div>

          {feedbackSuccess && (
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
              <span>{feedbackSuccess}</span>
            </div>
          )}

          <form onSubmit={handleFeedbackSubmit}>
            <div className="form-group">
              <label className="form-label">Meal to Review</label>
              <select
                className="form-select"
                value={mealType}
                onChange={(e) => setMealType(e.target.value)}
              >
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Evening Snacks">Evening Snacks</option>
                <option value="Dinner">Dinner</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Rating (Stars)</label>
              <div className="rating-stars-input">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    className={`star-btn ${star <= rating ? 'filled' : ''}`}
                    onClick={() => setRating(star)}
                    aria-label={`${star} Stars`}
                  >
                    ★
                  </button>
                ))}
                <span style={{ fontSize: '0.82rem', fontWeight: 700, marginLeft: '8px', color: '#b45309' }}>
                  {rating} of 5 Stars
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div className="form-group">
                <label className="form-label">Student Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Room</label>
                <input
                  type="text"
                  className="form-input"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Comments & Suggestions *</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="Mention taste, hygiene, chapati softness, spice levels, or delays..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            {feedbackError && (
              <div className="form-error" style={{ marginBottom: '14px' }}>
                <AlertCircle size={14} />
                <span>{feedbackError}</span>
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              <Send size={16} />
              <span>Submit Meal Feedback</span>
            </button>
          </form>
        </div>

        {/* Feedback Testimonials Card */}
        <div className="card">
          <div className="section-title-wrap">
            <h3 className="section-title" style={{ fontSize: '1.15rem' }}>
              <MessageSquare size={19} color="var(--primary)" /> Recent Resident Reviews
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {messFeedback.length} Submitted
            </span>
          </div>

          {messFeedback.length === 0 ? (
            <div className="empty-state">
              <p className="empty-desc">No reviews submitted yet. Be the first to rate today's meal!</p>
            </div>
          ) : (
            <div className="feedback-list">
              {messFeedback.map((fb) => (
                <div key={fb.id} className="feedback-card">
                  <div className="feedback-card-top">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                        {fb.mealType}
                      </span>
                      <span style={{ fontWeight: 700, fontSize: '0.86rem', color: 'var(--text-main)' }}>
                        {fb.studentName} {fb.room ? `(Rm ${fb.room})` : ''}
                      </span>
                    </div>

                    <div style={{ color: '#f59e0b', fontSize: '0.9rem', letterSpacing: '1px' }}>
                      {'★'.repeat(fb.rating)}
                      <span style={{ color: '#cbd5e1' }}>{'★'.repeat(5 - fb.rating)}</span>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.84rem', color: '#334155', lineHeight: 1.5, margin: '6px 0' }}>
                    "{fb.comment}"
                  </p>

                  <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', textAlign: 'right' }}>
                    {fb.date}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
