'use client';

import * as React from 'react';
import { useThemeStore } from '@/lib/store/theme-store';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((state) => state.theme);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      const isDark = theme === 'system' ? mediaQuery.matches : theme === 'dark';
      root.classList.toggle('dark', isDark);
    };

    applyTheme();

    if (theme === 'system') {
      mediaQuery.addEventListener('change', applyTheme);
      return () => mediaQuery.removeEventListener('change', applyTheme);
    }

    return undefined;
  }, [theme]);

  return <>{children}</>;
}
