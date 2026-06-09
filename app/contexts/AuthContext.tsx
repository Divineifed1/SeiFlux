'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type User = {
  login: string;
  avatar_url: string;
  name?: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  setUserFromStorage: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = () => {
    const storedUser = localStorage.getItem('seiflux_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('seiflux_user');
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = () => {
    const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
    if (!clientId) {
      console.error('GitHub Client ID not configured');
      return;
    }
    const redirectUri = `${window.location.origin}/auth/callback`;
    const scope = 'read:user user:email';
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}`;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('seiflux_user');
  };

  const setUserFromStorage = () => {
    loadUser();
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, setUserFromStorage }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function isAdmin(user: User | null): boolean {
  if (!user) return false;
  return user.login === 'Divineifed1';
}
