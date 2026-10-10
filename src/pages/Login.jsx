import React, { useState } from 'react';
import {
  Building2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { loginStudent } from '../services/authService';
import { isSupabaseConfigured } from '../services/supabase';

export default function Login({ onLoginSuccess, onNavigateRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please enter both your college email and password.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const user = await loginStudent({ email, password });
      if (user) {
        onLoginSuccess(user);
      }
    } catch (err) {
      setError(err.message || 'Failed to sign in. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Helper for 1-click Demo credentials
  const handleQuickDemoLogin = () => {
    setEmail('aarav.sharma@college.edu');
    setPassword('password123');
    setError('');
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card">
        {/* Brand Header */}
        <div className="auth-brand-header">
          <div className="auth-logo-icon">
            <Building2 size={26} strokeWidth={2.4} />
          </div>
          <h2 className="auth-title">Welcome to HostelHub</h2>
          <p className="auth-subtitle">Sign in to access your student hostel portal</p>
        </div>

        {/* Auth Mode Indicator */}
        <div className={`auth-mode-banner ${isSupabaseConfigured ? 'supabase-mode' : 'demo-mode'}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isSupabaseConfigured ? (
              <>
                <ShieldCheck size={16} color="#10b981" />
                <span>
                  <strong>Supabase Auth Active:</strong> Connected to live backend database.
                </span>
              </>
            ) : (
              <>
                <Sparkles size={16} color="#d97706" />
                <span>
                  <strong>Demo Mode Active:</strong> Supabase keys not set in <code>.env</code>. Using local student accounts.
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

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">College Email Address</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                className="form-input has-icon"
                placeholder="student@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label" style={{ marginBottom: '6px' }}>Password</label>
            </div>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input has-icon has-toggle"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary auth-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <span>Signing In...</span>
            ) : (
              <>
                <LogIn size={18} />
                <span>Sign In to Dashboard</span>
              </>
            )}
          </button>
        </form>

        {/* Demo Quick-Fill Button (Only shown in Demo Mode) */}
        {!isSupabaseConfigured && (
          <div className="demo-helper-box">
            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Hackathon Testing:</span>
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="btn btn-sm btn-secondary"
              style={{ fontSize: '0.76rem', gap: '6px' }}
            >
              <span>Auto-Fill Demo Student</span>
              <span style={{ fontFamily: 'var(--font-mono)', opacity: 0.8 }}>(Aarav)</span>
            </button>
          </div>
        )}

        {/* Registration Link */}
        <div className="auth-footer-link">
          <span>New hostel resident?</span>{' '}
          <button
            type="button"
            onClick={onNavigateRegister}
            className="link-btn"
          >
            Register Student Account <ArrowRight size={14} style={{ display: 'inline', verticalAlign: 'middle' }} />
          </button>
        </div>
      </div>
    </div>
  );
}
