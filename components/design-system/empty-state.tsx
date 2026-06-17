import * as React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface EmptyStateAction {
  label: string;
  onClick?: () => void;
}

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  className,
  size = 'md',
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        size === 'sm' && 'py-8 px-4',
        size === 'md' && 'py-16 px-6',
        size === 'lg' && 'py-24 px-8',
        className
      )}
    >
      {Icon && (
        <div
          className={cn(
            'flex items-center justify-center rounded-xl bg-muted mb-4',
            size === 'sm' && 'h-10 w-10',
            size === 'md' && 'h-14 w-14',
            size === 'lg' && 'h-16 w-16'
          )}
        >
          <Icon
            className={cn(
              'text-muted-foreground',
              size === 'sm' && 'h-5 w-5',
              size === 'md' && 'h-7 w-7',
              size === 'lg' && 'h-8 w-8'
            )}
          />
        </div>
      )}
      <h3
        className={cn(
          'font-semibold text-foreground',
          size === 'sm' && 'text-sm',
          (size === 'md' || size === 'lg') && 'text-base'
        )}
      >
        {title}
      </h3>
      {description && (
        <p
          className={cn(
            'mt-1.5 text-muted-foreground max-w-sm',
            size === 'sm' && 'text-xs',
            (size === 'md' || size === 'lg') && 'text-sm'
          )}
        >
          {description}
        </p>
      )}
      {(action || secondaryAction) && (
        <div className="mt-5 flex items-center gap-3">
          {action && (
            <Button size={size === 'sm' ? 'sm' : 'default'} onClick={action.onClick}>
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              variant="outline"
              size={size === 'sm' ? 'sm' : 'default'}
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
