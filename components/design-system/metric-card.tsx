import * as React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn, formatNumber } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

interface MetricCardProps {
  title: string;
  value: number | string;
  icon?: LucideIcon;
  change?: number;
  changeLabel?: string;
  prefix?: string;
  suffix?: string;
  description?: string;
  className?: string;
  accent?: boolean;
}

export function MetricCard({
  title,
  value,
  icon: Icon,
  change,
  changeLabel,
  prefix,
  suffix,
  description,
  className,
  accent = false,
}: MetricCardProps) {
  const formattedValue = typeof value === 'number' ? formatNumber(value) : value;
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;
  const isNeutral = change === 0;

  return (
    <Card
      className={cn(
        'relative overflow-hidden transition-all duration-200 hover:shadow-card-hover',
        accent && 'border-primary/30',
        className
      )}
    >
      {accent && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
      )}
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              {title}
            </p>
            <div className="flex items-baseline gap-1">
              {prefix && (
                <span className="text-sm text-muted-foreground">{prefix}</span>
              )}
              <span className="text-2xl font-bold text-foreground tabular-nums">
                {formattedValue}
              </span>
              {suffix && (
                <span className="text-sm text-muted-foreground">{suffix}</span>
              )}
            </div>
            {(change !== undefined || description) && (
              <div className="mt-2 flex items-center gap-1">
                {change !== undefined && (
                  <>
                    {isPositive && <TrendingUp className="h-3 w-3 text-green-400" />}
                    {isNegative && <TrendingDown className="h-3 w-3 text-red-400" />}
                    {isNeutral && <Minus className="h-3 w-3 text-muted-foreground" />}
                    <span
                      className={cn('text-xs font-medium', {
                        'text-green-400': isPositive,
                        'text-red-400': isNegative,
                        'text-muted-foreground': isNeutral,
                      })}
                    >
                      {isPositive ? '+' : ''}
                      {change}%
                    </span>
                  </>
                )}
                {changeLabel && (
                  <span className="text-xs text-muted-foreground">{changeLabel}</span>
                )}
                {description && !change && (
                  <span className="text-xs text-muted-foreground">{description}</span>
                )}
              </div>
            )}
          </div>
          {Icon && (
            <div
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-lg shrink-0',
                accent ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
