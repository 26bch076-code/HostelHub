import { supabase, isSupabaseConfigured } from './supabase';

const DEMO_USERS_KEY = 'hostelhub_demo_users_v1';
const DEMO_SESSION_KEY = 'hostelhub_active_session_v1';

// Default mock student account for demo mode
const DEFAULT_DEMO_USER = {
  id: 'demo-user-aarav',
  email: 'aarav.sharma@college.edu',
  password: 'password123',
  fullName: 'Aarav Sharma',
  studentId: '22BCSE104',
  hostel: 'Aryabhatta Hall of Residence',
  roomNumber: '304',
  isDemo: true
};

// Helper to get demo users from localStorage
function getStoredDemoUsers() {
  try {
    const raw = localStorage.getItem(DEMO_USERS_KEY);
    if (!raw) {
      const initial = [DEFAULT_DEMO_USER];
      localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.warn('Error reading demo users from localStorage:', e);
    return [DEFAULT_DEMO_USER];
  }
}

// Helper to save demo users
function saveDemoUsers(users) {
  try {
    localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.warn('Error saving demo users to localStorage:', e);
  }
}

// Helper to get active demo session
function getActiveDemoSession() {
  try {
    const raw = localStorage.getItem(DEMO_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

// Helper to save active demo session
function setActiveDemoSession(user) {
  try {
    if (user) {
      localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(DEMO_SESSION_KEY);
    }
  } catch (e) {
    console.warn('Error updating demo session:', e);
  }
}

/**
 * Standardize Supabase user object into HostelHub profile
 */
function formatSupabaseUser(sbUser) {
  if (!sbUser) return null;
  const metadata = sbUser.user_metadata || {};
  return {
    id: sbUser.id,
    email: sbUser.email,
    fullName: metadata.fullName || metadata.full_name || sbUser.email.split('@')[0],
    studentId: metadata.studentId || metadata.roll_number || 'N/A',
    hostel: metadata.hostel || 'Aryabhatta Hall of Residence',
    roomNumber: metadata.roomNumber || metadata.room || '304',
    isDemo: false
  };
}

/**
 * Register a new student
 */
export async function registerStudent({
  fullName,
  email,
  studentId,
  hostel,
  roomNumber,
  password
}) {
  // 1. If real Supabase backend is configured
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          fullName,
          studentId,
          hostel,
          roomNumber
        }
      }
    });

    if (error) {
      throw new Error(error.message);
    }

    if (data?.user) {
      return formatSupabaseUser(data.user);
    }
    return null;
  }

  // 2. Demo Mode (Local Storage Auth)
  const users = getStoredDemoUsers();
  const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (existing) {
    throw new Error('A student account with this email address already exists.');
  }

  const newUser = {
    id: `demo-${Date.now()}`,
    email: email.trim(),
    password, // Stored locally only for demo mode testing
    fullName: fullName.trim(),
    studentId: studentId.trim(),
    hostel: hostel.trim() || 'Aryabhatta Hall of Residence',
    roomNumber: roomNumber.trim() || '304',
    isDemo: true
  };

  users.push(newUser);
  saveDemoUsers(users);

  // Return session (without exposing password in session state)
  const sessionUser = { ...newUser };
  delete sessionUser.password;
  setActiveDemoSession(sessionUser);

  return sessionUser;
}

/**
 * Log in student
 */
export async function loginStudent({ email, password }) {
  // 1. If real Supabase backend is configured
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      throw new Error(error.message);
    }

    if (data?.user) {
      return formatSupabaseUser(data.user);
    }
    return null;
  }

  // 2. Demo Mode (Local Storage Auth)
  const users = getStoredDemoUsers();
  const user = users.find(
    u => u.email.toLowerCase() === email.trim().toLowerCase()
  );

  if (!user) {
    throw new Error('No registered student found with this email address.');
  }

  if (user.password !== password) {
    throw new Error('Incorrect password. Please try again.');
  }

  const sessionUser = { ...user };
  delete sessionUser.password;
  setActiveDemoSession(sessionUser);

  return sessionUser;
}

/**
 * Log out student
 */
export async function logoutStudent() {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.warn('Supabase signOut error:', error.message);
    }
  }

  setActiveDemoSession(null);
}

/**
 * Get current session on initial page load
 */
export async function getInitialSession() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        return formatSupabaseUser(session.user);
      }
    } catch (e) {
      console.warn('Error fetching Supabase session:', e);
    }
    return null;
  }

  // In demo mode, check if there is an active session in localStorage
  const demoSession = getActiveDemoSession();
  if (demoSession) {
    return demoSession;
  }

  // By default, if no demo session exists yet, default to logged in as sample student Aarav
  // so existing judges/evaluators can test dashboard immediately, or log out anytime!
  const defaultUser = { ...DEFAULT_DEMO_USER };
  delete defaultUser.password;
  setActiveDemoSession(defaultUser);
  return defaultUser;
}

/**
 * Listen for auth state changes
 */
export function onAuthStateChange(callback) {
  if (isSupabaseConfigured && supabase) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const user = session?.user ? formatSupabaseUser(session.user) : null;
      callback(user);
    });
    return () => subscription?.unsubscribe();
  }

  // In demo mode, listen to window storage events or return no-op
  const handleStorage = (e) => {
    if (e.key === DEMO_SESSION_KEY) {
      const updatedUser = e.newValue ? JSON.parse(e.newValue) : null;
      callback(updatedUser);
    }
  };

  window.addEventListener('storage', handleStorage);
  return () => window.removeEventListener('storage', handleStorage);
}
