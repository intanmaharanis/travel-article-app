import { create } from 'zustand';
import { type LoginPayload, type RegisterPayload, type UserResponse } from '../services/api';
import { authApi } from '../services/authApi';
import { toast } from 'sonner';

interface AuthState {
  user: UserResponse['user'] | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,

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
    set({ loading: true });
    try {
      const response = await authApi.login(payload);
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('token', response.jwt);
      set({ user: response.user, token: response.jwt, isAuthenticated: true });
      toast.success('Login successful!');
    } catch (error: any) {
      toast.error(error.message || 'Login failed.');
      console.error('Login error:', error);
    } finally {
      set({ loading: false });
    }
  },

  register: async (payload) => {
    set({ loading: true });
    try {
      const response = await authApi.register(payload);
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('token', response.jwt);
      set({ user: response.user, token: response.jwt, isAuthenticated: true });
      toast.success('Registration successful!');
    } catch (error: any) {
      toast.error(error.message || 'Registration failed.');
      console.error('Registration error:', error);
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