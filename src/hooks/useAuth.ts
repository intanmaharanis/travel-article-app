import { create } from 'zustand';
import { type LoginPayload, type RegisterPayload, type UserResponse } from '../services/api';
import { authApi } from '../services/authApi';
import { toast } from 'sonner';
import { useEffect } from 'react';

interface AuthState {
  user: UserResponse['user'] | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (payload: LoginPayload) => Promise<boolean>;
  register: (payload: RegisterPayload) => Promise<boolean>;
  logout: () => void;
  initializeAuth: () => void;
  error: string | null;
  setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  setError: (error) => set({ error }),

  initializeAuth: () => {
    try {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');
      if (storedUser && storedToken) {
        set({ user: JSON.parse(storedUser), token: storedToken, isAuthenticated: true });
      }
    } catch (error: unknown) {
      console.error("Failed to initialize auth from localStorage", error);
      // Clear potentially corrupted data
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      set({ user: null, token: null, isAuthenticated: false });
    }
  },

  login: async (payload) => {
    set({ loading: true, error: null });
    try {
      const response = await authApi.login(payload);
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('token', response.jwt);
      set({ user: response.user, token: response.jwt, isAuthenticated: true });
      toast.success('Login successful!');
      return true;
    } catch (error: unknown) {
      const errorMessage = (error instanceof Error) ? error.message : "Email/Password tidak sesuai";
      toast.error(errorMessage);
      console.error('Login error:', error);
      set({ error: errorMessage });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  register: async (payload) => {
    set({ loading: true, error: null });
    try {
      const response = await authApi.register(payload);
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('token', response.jwt);
      set({ user: response.user, token: response.jwt, isAuthenticated: true });
      toast.success('Registration successful!');
      return true;
    } catch (error: unknown) {
      const specificErrorMessage = (error instanceof Error && error.message) ? error.message : "Registrasi gagal. Coba lagi.";
      toast.error(specificErrorMessage);
      console.error('Registration error:', error);
      set({ error: specificErrorMessage });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
    toast.info('Logged out.');
  },
}));

export const useAuth = () => {
  const store = useAuthStore();
  
  // Initialize auth when the hook is first used (e.g., when the app mounts)
  useEffect(() => {
    store.initializeAuth();
  }, []); // Empty dependency array ensures this runs only once

  return store;
}; 