import { create } from 'zustand';

interface AuthStore {
  isAuthenticated: boolean;
  user: any | null; // Consider defining a more specific User type
  setAuth: (isAuthenticated: boolean, user: any | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  user: null,
  setAuth: (isAuthenticated, user) => set({ isAuthenticated, user }),
  clearAuth: () => set({ isAuthenticated: false, user: null }),
})); 