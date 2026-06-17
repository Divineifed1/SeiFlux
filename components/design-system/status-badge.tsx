import * as React from 'react';
import { cn } from '@/lib/utils';

type Status =
  | 'active'
  | 'approved'
  | 'published'
  | 'completed'
  | 'pending'
  | 'review'
  | 'draft'
  | 'rejected'
  | 'suspended'
  | 'inactive'
  | 'open'
  | 'closed';

interface StatusBadgeProps {
  status: Status | string;
  className?: string;
  showDot?: boolean;
}

const STATUS_CONFIG: Record<
  string,
  { label: string; className: string; dotClass: string }
> = {
  active:    { label: 'Active',     className: 'bg-green-500/10 text-green-400 ring-green-500/20',   dotClass: 'bg-green-400' },
  approved:  { label: 'Approved',   className: 'bg-green-500/10 text-green-400 ring-green-500/20',   dotClass: 'bg-green-400' },
  published: { label: 'Published',  className: 'bg-green-500/10 text-green-400 ring-green-500/20',   dotClass: 'bg-green-400' },
  completed: { label: 'Completed',  className: 'bg-green-500/10 text-green-400 ring-green-500/20',   dotClass: 'bg-green-400' },
  pending:   { label: 'Pending',    className: 'bg-yellow-500/10 text-yellow-400 ring-yellow-500/20', dotClass: 'bg-yellow-400' },
  review:    { label: 'In Review',  className: 'bg-yellow-500/10 text-yellow-400 ring-yellow-500/20', dotClass: 'bg-yellow-400' },
  draft:     { label: 'Draft',      className: 'bg-muted text-muted-foreground ring-border',           dotClass: 'bg-muted-foreground' },
  rejected:  { label: 'Rejected',   className: 'bg-red-500/10 text-red-400 ring-red-500/20',          dotClass: 'bg-red-400' },
  suspended: { label: 'Suspended',  className: 'bg-red-500/10 text-red-400 ring-red-500/20',          dotClass: 'bg-red-400' },
  inactive:  { label: 'Inactive',   className: 'bg-muted text-muted-foreground ring-border',           dotClass: 'bg-muted-foreground' },
  open:      { label: 'Open',       className: 'bg-blue-500/10 text-blue-400 ring-blue-500/20',       dotClass: 'bg-blue-400' },
  closed:    { label: 'Closed',     className: 'bg-muted text-muted-foreground ring-border',           dotClass: 'bg-muted-foreground' },
};

export function StatusBadge({ status, className, showDot = true }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? {
    label: status,
    className: 'bg-muted text-muted-foreground ring-border',
    dotClass: 'bg-muted-foreground',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset',
        config.className,
        className
      )}
    >
      {showDot && (
        <span className={cn('h-1.5 w-1.5 rounded-full', config.dotClass)} />
      )}
      {config.label}
    </span>
  );
}
