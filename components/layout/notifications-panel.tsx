'use client';
import * as React from 'react';
import Link from 'next/link';
import { Bell, Check, CheckCheck, X, FileText, FolderKanban, Building2, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn, formatRelativeTime } from '@/lib/utils';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'application' | 'project' | 'organization' | 'system';
  read: boolean;
  href?: string;
  createdAt: Date;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'New application received',
    message: 'alex_dev applied to "Fix slippage calculation" on SeiSwap DEX.',
    type: 'application',
    read: false,
    href: '/dashboard/applications',
    createdAt: new Date(Date.now() - 1000 * 60 * 12),
  },
  {
    id: '2',
    title: 'Project approved',
    message: 'SeiLend Protocol has been approved and is now publicly listed.',
    type: 'project',
    read: false,
    href: '/dashboard/projects',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: '3',
    title: 'New application received',
    message: 'sarah_builds applied to "Build analytics dashboard" on SeiSwap DEX.',
    type: 'application',
    read: false,
    href: '/dashboard/applications',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
  },
  {
    id: '4',
    title: 'Organization connected',
    message: 'SeiSwap Labs GitHub organization has been successfully connected.',
    type: 'organization',
    read: true,
    href: '/dashboard/organizations',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
  {
    id: '5',
    title: 'Platform update',
    message: 'New contributor discovery features are now available on the platform.',
    type: 'system',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
  },
];

const TYPE_ICONS = {
  application: FileText,
  project: FolderKanban,
  organization: Building2,
  system: Shield,
};

const TYPE_COLORS = {
  application: 'text-blue-400 bg-blue-500/10',
  project: 'text-primary bg-primary/10',
  organization: 'text-purple-400 bg-purple-500/10',
  system: 'text-muted-foreground bg-muted',
};

export function NotificationsPanel() {
  const [notifications, setNotifications] = React.useState(MOCK_NOTIFICATIONS);
  const [open, setOpen] = React.useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const dismiss = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="relative text-muted-foreground hover:text-foreground"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary animate-pulse" />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-[360px] p-0 shadow-xl"
        sideOffset={8}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
            {unreadCount > 0 && (
              <Badge variant="info" className="text-[10px] px-1.5 py-0 h-4">
                {unreadCount} new
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground h-6 px-2"
              onClick={markAllRead}
            >
              <CheckCheck className="h-3 w-3 mr-1" />
              Mark all read
            </Button>
          )}
        </div>

        {/* Notification list */}
        <ScrollArea className="max-h-[420px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
              <Bell className="h-8 w-8 text-muted-foreground/30 mb-3" />
              <p className="text-sm font-medium text-foreground">All caught up</p>
              <p className="text-xs text-muted-foreground mt-1">
                No new notifications right now.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {notifications.map((notification) => {
                const Icon = TYPE_ICONS[notification.type];
                const colorClass = TYPE_COLORS[notification.type];
                const content = (
                  <div
                    key={notification.id}
                    className={cn(
                      'flex items-start gap-3 px-4 py-3 transition-colors group/item',
                      !notification.read
                        ? 'bg-primary/3 hover:bg-primary/5'
                        : 'hover:bg-muted/30'
                    )}
                    onClick={() => markRead(notification.id)}
                  >
                    {/* Icon */}
                    <div
                      className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-lg shrink-0 mt-0.5',
                        colorClass
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={cn(
                            'text-xs font-medium leading-tight',
                            !notification.read
                              ? 'text-foreground'
                              : 'text-muted-foreground'
                          )}
                        >
                          {notification.title}
                        </p>
                        <div className="flex items-center gap-1 shrink-0">
                          {!notification.read && (
                            <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                          )}
                          <button
                            onClick={(e) => dismiss(notification.id, e)}
                            className="opacity-0 group-hover/item:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                        {notification.message}
                      </p>
                      <p className="text-[10px] text-muted-foreground/60 mt-1">
                        {formatRelativeTime(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                );

                return notification.href ? (
                  <Link href={notification.href} key={notification.id}>
                    {content}
                  </Link>
                ) : (
                  <div key={notification.id}>{content}</div>
                );
              })}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        <div className="border-t border-border p-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs text-muted-foreground justify-center h-8"
            asChild
          >
            <Link href="/dashboard/settings">View all notifications</Link>
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
