'use client';

import { Moon, Sun } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useThemeStore } from '@/lib/store/theme-store';

export function ThemeToggle() {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);

  return (
    <div className="flex items-center gap-3">
      <Sun className="h-4 w-4 text-foreground/70" />
      <Switch
        checked={theme === 'dark'}
        onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
        aria-label="Toggle dark mode"
      />
      <Moon className="h-4 w-4 text-foreground/70" />
    </div>
  );
}
