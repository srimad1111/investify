import { create } from 'zustand';

// Simple local auth using localStorage - no external dependencies needed
const DEMO_USERS_KEY = 'bullseye_users';
const SESSION_KEY = 'bullseye_session';

function getUsers() {
  try { return JSON.parse(localStorage.getItem(DEMO_USERS_KEY) || '{}'); }
  catch { return {}; }
}

function getSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); }
  catch { return null; }
}

// Initialize user from localStorage IMMEDIATELY (synchronous) so loading is always false
const storedUser = typeof window !== 'undefined' ? getSession() : null;

export const useAuthStore = create((set) => ({
  user: storedUser,
  loading: false,  // Never block on loading
  sebiAcknowledged: true,

  initializeAuth: () => {
    const session = getSession();
    set({ user: session, loading: false });
  },

  signUp: async (email, password, displayName) => {
    const users = getUsers();
    if (users[email]) {
      return { data: null, error: { message: 'User already exists. Please log in.' } };
    }
    const newUser = {
      id: `user_${Date.now()}`,
      email,
      password,
      user_metadata: { display_name: displayName || email.split('@')[0] }
    };
    users[email] = newUser;
    localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users));
    const sessionUser = { id: newUser.id, email: newUser.email, user_metadata: newUser.user_metadata };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    set({ user: sessionUser });
    return { data: sessionUser, error: null };
  },

  signIn: async (email, password) => {
    const users = getUsers();
    const found = users[email];
    if (!found || found.password !== password) {
      return { data: null, error: { message: 'Invalid email or password.' } };
    }
    const sessionUser = { id: found.id, email: found.email, user_metadata: found.user_metadata };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    set({ user: sessionUser });
    return { data: sessionUser, error: null };
  },

  signOut: () => {
    localStorage.removeItem(SESSION_KEY);
    set({ user: null });
  },

  setSebiAcknowledged: (status) => set({ sebiAcknowledged: status })
}));
