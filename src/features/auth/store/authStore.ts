import { create } from "zustand";

interface User {
    id: number;
    documentId: string;
    username: string;
    email: string;
}

interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
    login: (user: User, token: string) => void;
    logout: () => void;
    loadUser: () => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
}

export const useAuth = create<AuthState>((set) => ({
    isAuthenticated: !!localStorage.getItem('token'),
    user: null,
    token: null,
    login: (user, token) => {
        set({ user, token, isAuthenticated: true, isLoading: false, error: null });
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
    },

    logout: () => {
        set({ user: null, token: null, isAuthenticated: false, isLoading: false, error: null });
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    },

    loadUser: () => {
        const user = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (user && token) {
            set({ user: JSON.parse(user), token });
        }
    },
    isLoading: false,
    error: null,
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
}));