import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, startIcon, endIcon, ...props }, ref) => {
    if (startIcon || endIcon) {
      return (
        <div className="relative flex items-center">
          {startIcon && (
            <span className="absolute left-3 flex items-center text-muted-foreground [&_svg]:size-4 pointer-events-none">
              {startIcon}
            </span>
          )}
          <input
            type={type}
            className={cn(
              'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
              startIcon && 'pl-9',
              endIcon && 'pr-9',
              className
            )}
            ref={ref}
            {...props}
          />
          {endIcon && (
            <span className="absolute right-3 flex items-center text-muted-foreground [&_svg]:size-4 pointer-events-none">
              {endIcon}
            </span>
          )}
        </div>
      );
    }

    return (
      <input
        type={type}
        className={cn(
          'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
