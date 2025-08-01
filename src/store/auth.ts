import { create } from 'zustand';
import { User } from '@supabase/supabase-js';
import { AuthService, LoginCredentials, RegisterCredentials } from '../services/auth';

interface AuthStore {
  user: User | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Auth methods
  signIn: (credentials: LoginCredentials) => Promise<void>;
  signUp: (credentials: RegisterCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  loading: false,
  error: null,

  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  signIn: async (credentials) => {
    set({ loading: true, error: null });
    
    const { data, error } = await AuthService.signIn(credentials);
    
    if (error) {
      set({ loading: false, error: error.message });
    } else if (data?.user) {
      set({ user: data.user, loading: false, error: null });
    }
  },

  signUp: async (credentials) => {
    set({ loading: true, error: null });
    
    const { data, error } = await AuthService.signUp(credentials);
    
    if (error) {
      set({ loading: false, error: error.message });
    } else if (data?.user) {
      set({ user: data.user, loading: false, error: null });
    }
  },

  signOut: async () => {
    set({ loading: true });
    
    const { error } = await AuthService.signOut();
    
    if (error) {
      set({ loading: false, error: error.message });
    } else {
      set({ user: null, loading: false, error: null });
    }
  },

  checkAuth: async () => {
    set({ loading: true });
    
    const { user, error } = await AuthService.getCurrentUser();
    
    if (error) {
      set({ loading: false, error: error.message });
    } else {
      set({ user, loading: false, error: null });
    }
  },
})); 