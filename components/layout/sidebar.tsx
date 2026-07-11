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
  ChevronLeft,
  Zap,
  ShieldCheck,
  BarChart2,
  GitBranch,
  Compass,
  Activity,
  Bell,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuthStore } from '@/lib/store/auth-store';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { label: 'Discover', href: '/dashboard/discover', icon: Compass },
      { label: 'Activity', href: '/dashboard/activity', icon: Activity },
    ],
  },
  {
    title: 'Manage',
    items: [
      { label: 'Organizations', href: '/dashboard/organizations', icon: Building2 },
      { label: 'Projects', href: '/dashboard/projects', icon: FolderKanban },
      { label: 'Issues', href: '/dashboard/issues', icon: Zap },
      { label: 'Contributors', href: '/dashboard/contributors', icon: Users },
      { label: 'Applications', href: '/dashboard/applications', icon: FileText, badge: 2 },
      { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart2 },
    ],
  },
  {
    title: 'Integrations',
    items: [
      { label: 'GitHub', href: '/dashboard/github', icon: FolderGit2 },
      { label: 'Repositories', href: '/dashboard/github/repositories', icon: GitBranch },
    ],
  },
  {
    title: 'Account',
    items: [
      { label: 'Notifications', href: '/dashboard/notifications', icon: Bell, badge: 4 },
      { label: 'Settings', href: '/dashboard/settings', icon: Settings },
    ],
  },
];

const ADMIN_NAV_GROUP: NavGroup = {
  title: 'Admin',
  items: [
    { label: 'Admin Panel', href: '/dashboard/admin', icon: ShieldCheck },
  ],
};

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const navGroups = user?.role === 'admin'
    ? [...NAV_GROUPS, ADMIN_NAV_GROUP]
    : NAV_GROUPS;

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          'relative flex flex-col h-full bg-card border-r border-border transition-all duration-300 ease-in-out',
          collapsed ? 'w-[60px]' : 'w-[220px]'
        )}
      >
        {/* Logo */}
        <div
          className={cn(
            'flex items-center h-14 px-4 border-b border-border shrink-0',
            collapsed ? 'justify-center' : 'justify-between'
          )}
        >
          {collapsed ? (
            <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
          ) : (
            <Link href="/dashboard" className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center shrink-0">
                <Zap className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-sm text-foreground whitespace-nowrap">
                seiflux
              </span>
            </Link>
          )}
        </div>

        {/* Nav */}
        <ScrollArea className="flex-1 py-3">
          <nav className="px-2 space-y-4">
            {navGroups.map((group) => (
              <div key={group.title}>
                {!collapsed && (
                  <p className="px-2 mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                    {group.title}
                  </p>
                )}
                <ul className="space-y-0.5">
                  {group.items.map((item) => {
                    const isActive =
                      pathname === item.href ||
                      (item.href !== '/dashboard' && pathname.startsWith(item.href));
                    const Icon = item.icon;

                    if (collapsed) {
                      return (
                        <li key={item.href}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Link
                                href={item.href}
                                className={cn(
                                  'flex h-9 w-9 items-center justify-center rounded-md mx-auto transition-colors relative',
                                  isActive
                                    ? 'bg-primary/15 text-primary'
                                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                                )}
                              >
                                <Icon className="h-4 w-4" />
                                {item.badge !== undefined && item.badge > 0 && (
                                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
                                )}
                              </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                              {item.label}
                              {item.badge ? ` (${item.badge})` : ''}
                            </TooltipContent>
                          </Tooltip>
                        </li>
                      );
                    }

                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={cn(
                            'flex items-center gap-3 px-2 py-1.5 rounded-md text-sm transition-colors',
                            isActive
                              ? 'bg-primary/15 text-primary font-medium'
                              : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                          )}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          <span className="truncate flex-1">{item.label}</span>
                          {item.badge !== undefined && item.badge > 0 && (
                            <span className="ml-auto flex h-4 min-w-4 items-center justify-center rounded-full bg-primary/15 px-1 text-[10px] font-medium text-primary">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                {group !== navGroups[navGroups.length - 1] && collapsed && (
                  <Separator className="my-2 mx-2" />
                )}
              </div>
            ))}
          </nav>
        </ScrollArea>

        {/* Collapse toggle */}
        <div className="border-t border-border p-2 shrink-0">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onToggle}
            className={cn(
              'w-full h-8 text-muted-foreground hover:text-foreground',
              collapsed && 'mx-auto flex'
            )}
          >
            <ChevronLeft
              className={cn(
                'h-4 w-4 transition-transform duration-300',
                collapsed && 'rotate-180'
              )}
            />
            {!collapsed && <span className="ml-1 text-xs">Collapse</span>}
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  );
}
