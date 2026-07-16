'use client';
import * as React from 'react';
import Link from 'next/link';
import {
  Bell, CheckCheck, Trash2, CheckCircle2, XCircle, Zap, MessageSquare, GitMerge, Users, Coins,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/design-system/page-header';
import { EmptyState } from '@/components/design-system/empty-state';
import { useNotifications, useMarkAllRead, useMarkNotificationRead } from '@/lib/hooks/use-notifications';
import type { NotificationType } from '@/lib/hooks/use-notifications';
import { cn } from '@/lib/utils';

// ─── Type config ───────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<
  NotificationType,
  { label: string; icon: React.ElementType; color: string }
> = {
  application_accepted: { label: 'Accepted', icon: CheckCircle2, color: 'text-green-400 bg-green-500/10' },
  application_rejected: { label: 'Rejected', icon: XCircle, color: 'text-red-400 bg-red-500/10' },
  new_issue: { label: 'Issue', icon: Zap, color: 'text-yellow-400 bg-yellow-500/10' },
  issue_application: { label: 'Issue Application', icon: Bell, color: 'text-slate-400 bg-slate-500/10' },
  maintainer_message: { label: 'Message', icon: MessageSquare, color: 'text-blue-400 bg-blue-500/10' },
  project_update: { label: 'Project', icon: Bell, color: 'text-primary bg-primary/10' },
  pr_merged: { label: 'PR Merged', icon: GitMerge, color: 'text-green-400 bg-green-500/10' },
  new_contributor: { label: 'New Member', icon: Users, color: 'text-purple-400 bg-purple-500/10' },
  reward_received: { label: 'Reward', icon: Coins, color: 'text-amber-400 bg-amber-500/10' },
};

const FILTER_TABS: { label: string; value: NotificationType | 'all' | 'unread' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Unread', value: 'unread' },
  { label: 'Applications', value: 'application_accepted' },
  { label: 'Issues', value: 'new_issue' },
  { label: 'Messages', value: 'maintainer_message' },
];

export default function NotificationsPage() {
  const [filter, setFilter] = React.useState<NotificationType | 'all' | 'unread'>('all');
  const { data: notifications = [], isLoading } = useNotifications();
  const { mutate: markAllRead } = useMarkAllRead();
  const { mutate: markRead } = useMarkNotificationRead();

  const filtered = React.useMemo(() => {
    if (filter === 'unread') return notifications.filter((n) => !n.read);
    if (filter === 'all') return notifications;
    if (filter === 'application_accepted') {
      return notifications.filter(
        (n) => n.type === 'application_accepted' || n.type === 'application_rejected',
      );
    }
    return notifications.filter((n) => n.type === filter);
  }, [notifications, filter]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        title="Notifications"
        description="Stay on top of your applications, messages, and ecosystem updates."
        actions={
          unreadCount > 0 ? (
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => markAllRead()}
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all read
            </Button>
          ) : null
        }
      />

      {/* Unread count */}
      {unreadCount > 0 && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-primary/5 border border-primary/15">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <p className="text-sm text-foreground">
            You have <span className="font-semibold text-primary">{unreadCount} unread</span> notification{unreadCount !== 1 && 's'}.
          </p>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex items-center gap-1 p-0.5 rounded-lg bg-muted w-fit flex-wrap">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={cn(
              'px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5',
              filter === tab.value
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {tab.label}
            {tab.value === 'unread' && unreadCount > 0 && (
              <span className="h-4 w-4 rounded-full bg-primary text-primary-foreground text-[9px] flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Bell}
          title={filter === 'unread' ? 'All caught up' : 'No notifications'}
          description={
            filter === 'unread'
              ? 'You have no unread notifications.'
              : 'Notifications will appear here.'
          }
        />
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          {filtered.map((notif, i) => {
            const config = TYPE_CONFIG[notif.type];
            const Icon = config.icon;

            const content = (
              <div
                onClick={() => !notif.read && markRead(notif.id)}
                className={cn(
                  'flex items-start gap-4 px-5 py-4 transition-colors cursor-pointer group',
                  !notif.read
                    ? 'bg-primary/[0.03] hover:bg-primary/[0.06]'
                    : 'hover:bg-muted/30',
                  i !== 0 && 'border-t border-border/50',
                )}
              >
                {/* Icon */}
                <div className={cn(
                  'h-9 w-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5',
                  config.color,
                )}>
                  <Icon className="h-4 w-4" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={cn(
                        'text-sm font-medium',
                        notif.read ? 'text-muted-foreground' : 'text-foreground',
                      )}>
                        {notif.title}
                      </p>
                      <Badge className="text-[9px] px-1.5 py-0 h-4"
                        variant={
                          notif.type === 'application_accepted' ? 'success'
                            : notif.type === 'application_rejected' ? 'destructive'
                             : notif.type === 'new_issue' ? 'warning'
                            : 'muted'
                        }
                      >
                        {config.label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {!notif.read && (
                        <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                      )}
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                        {notif.createdAt}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {notif.message}
                  </p>
                  {notif.href && (
                    <Link
                      href={notif.href}
                      className="inline-flex items-center gap-1 mt-2 text-[11px] text-primary hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View details →
                    </Link>
                  )}
                </div>
              </div>
            );

            return <div key={notif.id}>{content}</div>;
          })}
        </div>
      )}
    </div>
  );
}
