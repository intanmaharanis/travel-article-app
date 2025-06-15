import { create } from 'zustand';
import { type LoginPayload, type RegisterPayload, type UserResponse } from '../services/api';
import { authApi } from '../services/authApi';
import { toast } from 'sonner';

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
    } catch (error) {
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
    } catch (error: any) {
      const errorMessage = "Email/Password tidak sesuai";
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
    } catch (error: any) {
      const specificErrorMessage = error.response?.data?.error?.message || "Registrasi gagal. Coba lagi.";
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

export const useAuth = () => useAuthStore(); 