'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'admin' | 'maintainer' | 'contributor';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  githubUsername?: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  initializeFromStorage: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,

      login: (user) => set({ user, isAuthenticated: true, isLoading: false }),

      logout: () => set({ user: null, isAuthenticated: false, isLoading: false }),

      setLoading: (isLoading) => set({ isLoading }),

      initializeFromStorage: () => {
        if (typeof window === 'undefined') return;
        const token = localStorage.getItem('auth_token');
        const userStr = localStorage.getItem('auth_user');
        if (token && userStr) {
          try {
            const user = JSON.parse(userStr);
            set({ user, isAuthenticated: true, isLoading: false });
          } catch (e) {
            set({ user: null, isAuthenticated: false, isLoading: false });
          }
        } else {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'sei-builders-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export const MOCK_MAINTAINER: AuthUser = {
  id: 'user_01',
  name: 'Alex Builder',
  email: 'alex@seiswap.example.com',
  role: 'maintainer',
  githubUsername: 'alexbuilder',
};

export const MOCK_ADMIN: AuthUser = {
  id: 'user_admin',
  name: 'Platform Admin',
  email: 'admin@seibuilders.example.com',
  role: 'admin',
  githubUsername: 'sei_admin',
};

export const MOCK_CONTRIBUTOR: AuthUser = {
  id: 'user_02',
  name: 'Dev Contributor',
  email: 'dev@example.com',
  role: 'contributor',
  githubUsername: 'devcontributor',
};