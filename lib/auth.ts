'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

// ——— Types ———
export type AppName = 'X' | 'LinkedIn';
export type SubscriptionTier = 'FREE' | 'PRO' | 'TEAM';

export interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  profile_url?: string;
  app_name: AppName;
  subscriptionTier: SubscriptionTier;
  isPrivate: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  setUser: (u: User | null) => void;
  setToken: (t: string | null) => void;
  setError: (e: string | null) => void;
  setLoading: (l: boolean) => void;
  logout: () => void;
}

// ——— Store ———
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      setUser: (user) => {
        console.log('[Auth] setUser', user);
        set({ user });
      },
      setToken: (token) => {
        console.log('[Auth] setToken', token);
        set({ token });
        if (token) {
          localStorage.setItem('authToken', token);
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
          delete axios.defaults.headers.common['Authorization'];
        }
      },
      setError: (error) => {
        console.log('[Auth] setError', error);
        set({ error });
      },
      setLoading: (isLoading) => {
        console.log('[Auth] setLoading', isLoading);
        set({ isLoading });
      },
      logout: () => {
        console.log('[Auth] logout');
        delete axios.defaults.headers.common['Authorization'];
        localStorage.removeItem('authToken');
        localStorage.removeItem('auth-storage');
        set({ user: null, token: null, error: null });
      },
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          console.log('[Auth] rehydrate token', state.token);
          axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
        }
      },
    }
  )
);

// ——— Service ———
class AuthService {
  private static instance: AuthService;
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

  private constructor() {}

  static getInstance() {
    if (!AuthService.instance) AuthService.instance = new AuthService();
    return AuthService.instance;
  }
  public initiateOAuth(provider: 'twitter' | 'linkedin') {
    const returnUrl = encodeURIComponent(window.location.origin + '/auth/callback');
    window.location.href = `${this.baseUrl}/auth/${provider}?returnUrl=${returnUrl}`;
  }
  
  async handleCallback(token: string) {
    const { setUser, setToken, setError, setLoading } = useAuthStore.getState();

    try {
      setLoading(true);
      setError(null);

      if (!token) throw new Error('No token provided');

      // 1) establish header immediately
      setToken(token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // 2) fetch & pick out the user object
      const { data } = await axios.get(`${this.baseUrl}/auth/verify`);
      const userObj = data.user ?? data.data ?? data;
      if (!userObj?.id) throw new Error('Invalid verify response');

      setUser(userObj);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Authentication failed';
      console.error('[Auth] handleCallback error:', msg);
      setError(msg);
      this.logout();
      throw err;
    } finally {
      setLoading(false);
    }
  }

  isAuthenticated() {
    const { token, user } = useAuthStore.getState();
    return !!(token && user);
  }

  async validateToken() {
    const { token, setUser } = useAuthStore.getState();
    if (!token) return false;
    try {
      const { data } = await axios.get(`${this.baseUrl}/auth/verify`);
      const userObj = data.user ?? data.data ?? data;
      if (userObj?.id) {
        setUser(userObj);
        return true;
      }
    } catch {
      // fall through
    }
    this.logout();
    return false;
  }

  logout() {
    useAuthStore.getState().logout();
  }
}

export const authService = AuthService.getInstance();
export function useAuth() {
  return useAuthStore();
}
