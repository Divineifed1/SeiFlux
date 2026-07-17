'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function updateUserPayoutAddress(userId: string, payoutAddress: string): Promise<AuthUser> {
  const res = await fetch(`${API_BASE}/users/${userId}/payout-address`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ payoutAddress }),
  });
  if (!res.ok) {
    throw new Error('Failed to update payout address');
  }
  return res.json();
}

export type UserRole = 'admin' | 'maintainer' | 'contributor';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  githubUsername?: string;
  walletAddress?: string;
  walletType?: string;
  payoutAddress?: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  initializeFromStorage: () => void;
  setWallet: (walletAddress: string, walletType: string) => void;
  setPayoutAddress: (payoutAddress: string) => void;
  updatePayoutAddress: (payoutAddress: string) => Promise<void>;
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

      setWallet: (walletAddress: string, walletType: string) => {
        const user = get().user;
        if (!user) return;
        set({ user: { ...user, walletAddress, walletType } });
      },

      setPayoutAddress: (payoutAddress: string) => {
        const user = get().user;
        if (!user) return;
        set({ user: { ...user, payoutAddress } });
      },

      updatePayoutAddress: async (payoutAddress: string) => {
        const user = get().user;
        if (!user) return;
        const updatedUser = await updateUserPayoutAddress(user.id, payoutAddress);
        set({ user: updatedUser });
      },

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