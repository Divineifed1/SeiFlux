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
  BarChart2,
  GitBranch,
  Compass,
  Activity,
  Bell,
  Gauge,
  Trophy,
  Medal,
  Crown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useAuthStore } from '@/lib/store/auth-store';
import { useContributorApplications } from '@/lib/hooks/use-contributor-applications';

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

const OVERVIEW_GROUP: NavGroup = {
  title: 'Overview',
  items: [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Discover', href: '/dashboard/discover', icon: Compass },
    { label: 'Activity', href: '/dashboard/activity', icon: Activity },
  ],
};

const INTEGRATIONS_GROUP: NavGroup = {
  title: 'Integrations',
  items: [
    { label: 'GitHub', href: '/dashboard/github', icon: FolderGit2 },
    { label: 'Repositories', href: '/dashboard/github/repositories', icon: GitBranch },
  ],
};

const ACCOUNT_GROUP: NavGroup = {
  title: 'Account',
  items: [
    { label: 'Notifications', href: '/dashboard/notifications', icon: Bell },
    { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  ],
};

const REWARDS_GROUP: NavGroup = {
  title: 'Rewards',
  items: [{ label: 'My Rewards', href: '/dashboard/rewards', icon: Trophy }],
};

const MANAGE_GROUP: NavGroup = {
  title: 'Manage',
  items: [
    { label: 'Organizations', href: '/dashboard/organizations', icon: Building2 },
    { label: 'Projects', href: '/dashboard/projects', icon: FolderKanban },
    { label: 'Issues', href: '/dashboard/issues', icon: Zap },
    { label: 'Contributors', href: '/dashboard/contributors', icon: Users },
    { label: 'Applications', href: '/dashboard/applications', icon: FileText },
    { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart2 },
  ],
};

const ADMIN_GROUP: NavGroup = {
  title: 'Admin',
  items: [
    { label: 'Admin Panel', href: '/dashboard/admin', icon: ShieldCheck },
    { label: 'All-Waves Leaderboard', href: '/dashboard/admin/leaderboard', icon: Crown },
  ],
};

interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function MobileSidebar({ open, onClose }: MobileSidebarProps) {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const { usedSlots } = useContributorApplications();

  const navGroups = React.useMemo<NavGroup[]>(() => {
    const contributorGroup: NavGroup = {
      title: 'Contributor',
      items: [
        { label: 'Application Limits', href: '/dashboard/contributor/application-limits', icon: Gauge, badge: usedSlots },
        { label: 'My Issues', href: '/dashboard/contributor/issues', icon: Zap },
        { label: 'Leaderboard', href: '/dashboard/leaderboard', icon: Medal },
      ],
    };
    const maintainerGroup: NavGroup = {
      title: 'Maintainer',
      items: [
        { label: 'Issues', href: '/dashboard/maintainer/issues', icon: Zap },
        { label: 'Analytics', href: '/dashboard/maintainer/analytics', icon: BarChart2 },
        { label: 'Leaderboard', href: '/dashboard/leaderboard', icon: Medal },
        { label: 'Projects', href: '/dashboard/projects', icon: FolderKanban },
        { label: 'Contributors', href: '/dashboard/contributors', icon: Users },
      ],
    };

    switch (user?.role) {
      case 'contributor':
      case 'maintainer':
        return [OVERVIEW_GROUP, contributorGroup, maintainerGroup, REWARDS_GROUP, INTEGRATIONS_GROUP, ACCOUNT_GROUP];
      case 'admin':
        return [
          OVERVIEW_GROUP,
          contributorGroup,
          maintainerGroup,
          MANAGE_GROUP,
          REWARDS_GROUP,
          INTEGRATIONS_GROUP,
          ADMIN_GROUP,
          ACCOUNT_GROUP,
        ];
      default:
        return [OVERVIEW_GROUP, INTEGRATIONS_GROUP, ACCOUNT_GROUP];
    }
  }, [user?.role, usedSlots]);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="w-[70%] h-[90vh] flex flex-col p-0">
        <DialogTitle className="sr-only">Navigation</DialogTitle>

        {/* Header */}
        <div className="flex items-center justify-between h-14 px-4 border-b border-border shrink-0">
          <Link href="/dashboard" className="flex items-center gap-2.5" onClick={onClose}>
            <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-sm text-foreground">Seiflux</span>
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