import {
  INITIAL_COMPLAINTS,
  INITIAL_NOTICES,
  INITIAL_MESS_FEEDBACK,
  INITIAL_LOST_FOUND
} from './initialData';

const STORAGE_KEYS = {
  COMPLAINTS: 'hostelhub_complaints_v1',
  NOTICES: 'hostelhub_notices_v1',
  MESS_FEEDBACK: 'hostelhub_mess_feedback_v1',
  LOST_FOUND: 'hostelhub_lost_found_v1'
};

// Safe helper to read from localStorage with fallback
function loadFromStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(saved);
  } catch (error) {
    console.warn(`Error reading key "${key}" from localStorage:`, error);
    return fallback;
  }
}

// Safe helper to save to localStorage
function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Error saving key "${key}" to localStorage:`, error);
  }
}

// Complaints
export function getComplaints() {
  return loadFromStorage(STORAGE_KEYS.COMPLAINTS, INITIAL_COMPLAINTS);
}

export function saveComplaints(complaints) {
  saveToStorage(STORAGE_KEYS.COMPLAINTS, complaints);
}

// Notices
export function getNotices() {
  return loadFromStorage(STORAGE_KEYS.NOTICES, INITIAL_NOTICES);
}

export function saveNotices(notices) {
  saveToStorage(STORAGE_KEYS.NOTICES, notices);
}

// Mess Feedback
export function getMessFeedback() {
  return loadFromStorage(STORAGE_KEYS.MESS_FEEDBACK, INITIAL_MESS_FEEDBACK);
}

export function saveMessFeedback(feedbackList) {
  saveToStorage(STORAGE_KEYS.MESS_FEEDBACK, feedbackList);
}

// Lost & Found
export function getLostFound() {
  return loadFromStorage(STORAGE_KEYS.LOST_FOUND, INITIAL_LOST_FOUND);
}

export function saveLostFound(items) {
  saveToStorage(STORAGE_KEYS.LOST_FOUND, items);
}

// Reset everything to defaults (Great for hackathon judging demo)
export function resetAllData() {
  try {
    localStorage.removeItem(STORAGE_KEYS.COMPLAINTS);
    localStorage.removeItem(STORAGE_KEYS.NOTICES);
    localStorage.removeItem(STORAGE_KEYS.MESS_FEEDBACK);
    localStorage.removeItem(STORAGE_KEYS.LOST_FOUND);
  } catch (e) {
    console.warn('Error clearing storage:', e);
  }
}
