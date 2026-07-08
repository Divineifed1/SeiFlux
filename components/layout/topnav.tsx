'use client';
import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Shield,
  Menu,
  Wallet,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { NotificationsPanel } from '@/components/layout/notifications-panel';
import { useAuthStore } from '@/lib/store/auth-store';
import { WalletButton } from '@/components/ui/wallet-button';
import { initials } from '@/lib/utils';

const ROLE_LABELS = {
  admin: 'Admin',
  maintainer: 'Maintainer',
  contributor: 'Contributor',
};

const ROLE_BADGE_VARIANT = {
  admin: 'default' as const,
  maintainer: 'success' as const,
  contributor: 'info' as const,
};

interface TopNavProps {
  onMobileMenuOpen?: () => void;
  onSearchOpen?: () => void;
}

export function TopNav({ onMobileMenuOpen, onSearchOpen }: TopNavProps) {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/sign-in');
  };

  if (!user) return null;

  return (
    <header className="flex h-14 items-center gap-3 border-b border-border bg-background/95 backdrop-blur-sm px-4 lg:px-6 shrink-0">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon-sm"
        className="lg:hidden text-muted-foreground shrink-0"
        onClick={onMobileMenuOpen}
      >
        <Menu className="h-4 w-4" />
      </Button>

      {/* Search — opens command palette */}
      <div className="flex-1 max-w-sm">
        <button
          onClick={onSearchOpen}
          className="w-full flex items-center gap-2 h-8 px-3 rounded-md bg-muted text-xs text-muted-foreground hover:bg-muted/80 transition-colors border-0 text-left"
        >
          <Search className="h-3.5 w-3.5 shrink-0" />
          <span className="flex-1">Search…</span>
          <kbd className="hidden sm:flex items-center gap-0.5 text-[10px] font-mono border border-border/60 rounded px-1 py-0.5 bg-background/50">
            ⌘K
          </kbd>
        </button>
      </div>

      <div className="flex items-center gap-1 ml-auto">
        {/* Wallet */}
        <WalletButton />

        {/* Notifications */}
        <NotificationsPanel />

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2 h-9 text-sm">
              <Avatar className="h-7 w-7">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="text-[10px] bg-primary/20 text-primary font-semibold">
                  {initials(user.name)}
                </AvatarFallback>
              </Avatar>
              <span className="hidden sm:block text-sm font-medium">
                {user.name.split(' ')[0]}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">{user.name}</span>
                  <Badge
                    variant={ROLE_BADGE_VARIANT[user.role]}
                    className="text-[10px] px-1.5"
                  >
                    {ROLE_LABELS[user.role]}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">{user.email}</span>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>

            {user.role === 'admin' && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center gap-2 text-primary">
                  <Shield className="h-4 w-4" />
                  Admin Panel
                </DropdownMenuItem>
              </>
            )}

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleLogout}
              className="flex items-center gap-2 text-destructive focus:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
