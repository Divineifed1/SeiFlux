'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard, Building2, FolderKanban, Users, FileText,
  FolderGit2, Settings, Zap, BarChart2, GitBranch, Compass,
  Activity, Bell, ShieldCheck, Search, ArrowRight, Hash,
} from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ElementType;
  href: string;
  group: string;
  keywords?: string[];
}

const ALL_COMMANDS: CommandItem[] = [
  // Navigation
  { id: 'nav-dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard', group: 'Navigation' },
  { id: 'nav-discover', label: 'Discover', description: 'Find projects and opportunities', icon: Compass, href: '/dashboard/discover', group: 'Navigation', keywords: ['search', 'find', 'explore'] },
  { id: 'nav-activity', label: 'Activity Feed', icon: Activity, href: '/dashboard/activity', group: 'Navigation' },
  { id: 'nav-notifications', label: 'Notifications', icon: Bell, href: '/dashboard/notifications', group: 'Navigation' },
  { id: 'nav-analytics', label: 'Analytics', icon: BarChart2, href: '/dashboard/analytics', group: 'Navigation', keywords: ['stats', 'metrics', 'charts'] },
  // Manage
  { id: 'nav-orgs', label: 'Organizations', icon: Building2, href: '/dashboard/organizations', group: 'Manage' },
  { id: 'nav-projects', label: 'Projects', icon: FolderKanban, href: '/dashboard/projects', group: 'Manage' },
  { id: 'nav-opps', label: 'Issues', icon: Zap, href: '/dashboard/issues', group: 'Manage', keywords: ['bounty', 'issue', 'job'] },
  { id: 'nav-contributors', label: 'Contributors', icon: Users, href: '/dashboard/contributors', group: 'Manage', keywords: ['devs', 'developers', 'team'] },
  { id: 'nav-applications', label: 'Applications', icon: FileText, href: '/dashboard/applications', group: 'Manage' },
  // Integrations
  { id: 'nav-github', label: 'GitHub Integration', icon: FolderGit2, href: '/dashboard/github', group: 'Integrations' },
  { id: 'nav-repos', label: 'Repositories', icon: GitBranch, href: '/dashboard/github/repositories', group: 'Integrations', keywords: ['repos', 'code'] },
  // Account
  { id: 'nav-settings', label: 'Settings', icon: Settings, href: '/dashboard/settings', group: 'Account' },
  { id: 'nav-admin', label: 'Admin Panel', icon: ShieldCheck, href: '/dashboard/admin', group: 'Admin', keywords: ['admin', 'moderation'] },
  // Quick actions
  { id: 'act-new-project', label: 'New Project', description: 'Start a new project wizard', icon: FolderKanban, href: '/dashboard/projects/new', group: 'Quick Actions', keywords: ['create', 'add'] },
  { id: 'act-new-opp', label: 'Post Issue', description: 'Create a new issue', icon: Zap, href: '/dashboard/issues', group: 'Quick Actions', keywords: ['create', 'bounty', 'add'] },
];

const GROUP_ORDER = ['Quick Actions', 'Navigation', 'Manage', 'Integrations', 'Account', 'Admin'];

interface CommandMenuProps {
  open: boolean;
  onClose: () => void;
}

export function CommandMenu({ open, onClose }: CommandMenuProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState('');
  const [activeIndex, setActiveIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Reset on open
  React.useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const filtered = React.useMemo(() => {
    if (!query.trim()) return ALL_COMMANDS;
    const q = query.toLowerCase();
    return ALL_COMMANDS.filter(
      (cmd) =>
        cmd.label.toLowerCase().includes(q) ||
        (cmd.description ?? '').toLowerCase().includes(q) ||
        (cmd.keywords ?? []).some((k) => k.includes(q)) ||
        cmd.group.toLowerCase().includes(q),
    );
  }, [query]);

  // Group results
  const grouped = React.useMemo(() => {
    const map = new Map<string, CommandItem[]>();
    for (const cmd of filtered) {
      if (!map.has(cmd.group)) map.set(cmd.group, []);
      map.get(cmd.group)!.push(cmd);
    }
    const out: { group: string; items: CommandItem[] }[] = [];
    for (const g of GROUP_ORDER) {
      if (map.has(g)) out.push({ group: g, items: map.get(g)! });
    }
    return out;
  }, [filtered]);

  // Flat list for keyboard nav
  const flatList = grouped.flatMap((g) => g.items);

  const handleSelect = (item: CommandItem) => {
    router.push(item.href);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, flatList.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const item = flatList[activeIndex];
      if (item) handleSelect(item);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  // Reset index when filtered list changes
  React.useEffect(() => { setActiveIndex(0); }, [query]);

  let itemOffset = 0;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="p-0 gap-0 max-w-[560px] overflow-hidden rounded-xl border border-border shadow-2xl">
        <DialogTitle className="sr-only">Command Menu</DialogTitle>

        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search pages, actions…"
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          <kbd className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-border text-[10px] text-muted-foreground font-mono">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[400px] overflow-y-auto py-2">
          {filtered.length === 0 ? (
            <div className="py-10 text-center">
              <Hash className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No results for &quot;{query}&quot;</p>
            </div>
          ) : (
            grouped.map(({ group, items }) => {
              const groupStart = itemOffset;
              itemOffset += items.length;
              return (
                <div key={group}>
                  <p className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
                    {group}
                  </p>
                  {items.map((item, i) => {
                    const globalIdx = groupStart + i;
                    const isActive = globalIdx === activeIndex;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelect(item)}
                        onMouseEnter={() => setActiveIndex(globalIdx)}
                        className={cn(
                          'w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors',
                          isActive ? 'bg-primary/10' : 'hover:bg-muted/50',
                        )}
                      >
                        <div className={cn(
                          'h-8 w-8 rounded-lg flex items-center justify-center shrink-0 transition-colors',
                          isActive ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground',
                        )}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={cn(
                            'text-sm font-medium truncate',
                            isActive ? 'text-primary' : 'text-foreground',
                          )}>
                            {item.label}
                          </p>
                          {item.description && (
                            <p className="text-[11px] text-muted-foreground truncate">{item.description}</p>
                          )}
                        </div>
                        {isActive && <ArrowRight className="h-3.5 w-3.5 text-primary shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>

        {/* Footer hints */}
        <div className="flex items-center gap-4 px-4 py-2 border-t border-border bg-muted/20">
          <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <kbd className="px-1 py-0.5 rounded border border-border text-[10px] font-mono">↑↓</kbd>
            Navigate
          </span>
          <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <kbd className="px-1 py-0.5 rounded border border-border text-[10px] font-mono">↵</kbd>
            Open
          </span>
          <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <kbd className="px-1 py-0.5 rounded border border-border text-[10px] font-mono">ESC</kbd>
            Close
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
