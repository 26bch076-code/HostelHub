import React, { useState } from 'react';
import {
  Building2,
  User,
  Mail,
  IdCard,
  Home,
  DoorClosed,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { registerStudent } from '../services/authService';
import { isSupabaseConfigured } from '../services/supabase';

const COMMON_HOSTELS = [
  'Aryabhatta Hall of Residence (Boys)',
  'Ramanujan Hall of Residence (Boys)',
  'Homi Bhabha Hall of Residence (Boys)',
  'Sarojini Naidu Hall of Residence (Girls)',
  'Gargi Hall of Residence (Girls)',
  'Kalpana Chawla Hall of Residence (Girls)'
];

export default function Register({ onRegisterSuccess, onNavigateLogin }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [studentId, setStudentId] = useState('');
  const [hostel, setHostel] = useState(COMMON_HOSTELS[0]);
  const [roomNumber, setRoomNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid college email address.');
      return;
    }
    if (!studentId.trim()) {
      setError('Please provide your student ID or roll number.');
      return;
    }
    if (!roomNumber.trim()) {
      setError('Please enter your assigned hostel room number.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify your password confirmation.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const user = await registerStudent({
        fullName,
        email,
        studentId,
        hostel,
        roomNumber,
        password
      });

      if (user) {
        onRegisterSuccess(user);
      }
    } catch (err) {
      setError(err.message || 'Failed to create student account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card register-card">
        {/* Brand Header */}
        <div className="auth-brand-header">
          <div className="auth-logo-icon">
            <Building2 size={26} strokeWidth={2.4} />
          </div>
          <h2 className="auth-title">Student Registration</h2>
          <p className="auth-subtitle">Create your HostelHub resident account</p>
        </div>

        {/* Mode Indicator */}
        <div className={`auth-mode-banner ${isSupabaseConfigured ? 'supabase-mode' : 'demo-mode'}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isSupabaseConfigured ? (
              <>
                <ShieldCheck size={16} color="#10b981" />
                <span>
                  <strong>Supabase Auth:</strong> Real user account will be registered in your Supabase project.
                </span>
              </>
            ) : (
              <>
                <Sparkles size={16} color="#d97706" />
                <span>
                  <strong>Demo Mode:</strong> Account will be stored in browser <code>localStorage</code> for hackathon testing.
                </span>
              </>
            )}
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="auth-error-box">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Full Name & Student ID */}
          <div className="form-row-grid">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <div className="input-with-icon">
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  className="form-input has-icon"
                  placeholder="e.g. Rohit Kumar"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Student ID / Roll No *</label>
              <div className="input-with-icon">
                <IdCard size={18} className="input-icon" />
                <input
                  type="text"
                  className="form-input has-icon"
                  placeholder="e.g. 23BCSE120"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label">College Email Address *</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                className="form-input has-icon"
                placeholder="student@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Hostel & Room Number */}
          <div className="form-row-grid">
            <div className="form-group">
              <label className="form-label">Hostel Residence *</label>
              <div className="input-with-icon">
                <Home size={18} className="input-icon" />
                <select
                  className="form-select has-icon"
                  value={hostel}
                  onChange={(e) => setHostel(e.target.value)}
                  required
                >
                  {COMMON_HOSTELS.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Room Number *</label>
              <div className="input-with-icon">
                <DoorClosed size={18} className="input-icon" />
                <input
                  type="text"
                  className="form-input has-icon"
                  placeholder="e.g. 214"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Passwords */}
          <div className="form-row-grid">
            <div className="form-group">
              <label className="form-label">Password *</label>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input has-icon has-toggle"
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input has-icon"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary auth-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <span>Creating Account...</span>
            ) : (
              <>
                <UserPlus size={18} />
                <span>Complete Registration</span>
              </>
            )}
          </button>
        </form>

        {/* Back to Login Link */}
        <div className="auth-footer-link">
          <span>Already registered?</span>{' '}
          <button
            type="button"
            onClick={onNavigateLogin}
            className="link-btn"
          >
            <ArrowLeft size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> Sign In Here
          </button>
        </div>
      </div>
    </div>
  );
}
