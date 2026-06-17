'use client';
import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  FolderKanban,
  Users,
  FileText,
  FolderGit2,
  Settings,
  X,
  Zap,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useAuthStore } from '@/lib/store/auth-store';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const BASE_NAV_GROUPS: NavGroup[] = [
  {
    title: 'Overview',
    items: [{ label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard }],
  },
  {
    title: 'Manage',
    items: [
      { label: 'Organizations', href: '/dashboard/organizations', icon: Building2 },
      { label: 'Projects', href: '/dashboard/projects', icon: FolderKanban },
      { label: 'Contributors', href: '/dashboard/contributors', icon: Users },
      { label: 'Applications', href: '/dashboard/applications', icon: FileText },
    ],
  },
  {
    title: 'Integrations',
    items: [{ label: 'GitHub', href: '/dashboard/github', icon: FolderGit2 }],
  },
  {
    title: 'Account',
    items: [{ label: 'Settings', href: '/dashboard/settings', icon: Settings }],
  },
];

interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function MobileSidebar({ open, onClose }: MobileSidebarProps) {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const navGroups = user?.role === 'admin'
    ? [...BASE_NAV_GROUPS, { title: 'Admin', items: [{ label: 'Admin Panel', href: '/dashboard/admin', icon: ShieldCheck }] }]
    : BASE_NAV_GROUPS;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="fixed inset-y-0 left-0 z-50 h-full w-[260px] max-w-none rounded-none p-0 border-r border-border shadow-xl data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left"
        style={{ animation: open ? 'slide-in-from-left 0.2s ease-out' : undefined }}
      >
        <DialogTitle className="sr-only">Navigation</DialogTitle>

        {/* Header */}
        <div className="flex items-center justify-between h-14 px-4 border-b border-border shrink-0">
          <Link href="/dashboard" className="flex items-center gap-2.5" onClick={onClose}>
            <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-sm text-foreground">SEI Builders</span>
          </Link>
          <Button variant="ghost" size="icon-sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Nav */}
        <ScrollArea className="flex-1 py-3">
          <nav className="px-2 space-y-4">
            {navGroups.map((group) => (
              <div key={group.title}>
                <p className="px-2 mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                  {group.title}
                </p>
                <ul className="space-y-0.5">
                  {group.items.map((item) => {
                    const isActive =
                      pathname === item.href ||
                      (item.href !== '/dashboard' && pathname.startsWith(item.href));
                    const Icon = item.icon;
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={onClose}
                          className={cn(
                            'flex items-center gap-3 px-2 py-2 rounded-md text-sm transition-colors',
                            isActive
                              ? 'bg-primary/15 text-primary font-medium'
                              : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                          )}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          <span>{item.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                <Separator className="mt-3" />
              </div>
            ))}
          </nav>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
