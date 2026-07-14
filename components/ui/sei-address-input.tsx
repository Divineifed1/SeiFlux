'use client';
import * as React from 'react';
import { CheckCircle2, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { validateSeiAddress, seiAddressTypeLabel } from '@/lib/validation/sei-address';
import { cn } from '@/lib/utils';

interface SeiAddressInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidChange?: (valid: boolean, normalized: string) => void;
  placeholder?: string;
  id?: string;
  className?: string;
}

export function SeiAddressInput({
  value,
  onChange,
  onValidChange,
  placeholder = 'sei1… or 0x…',
  id,
  className,
}: SeiAddressInputProps) {
  const [touched, setTouched] = React.useState(false);

  const validation = validateSeiAddress(value);
  const showError = touched && value.trim().length > 0 && !validation.valid;

  React.useEffect(() => {
    onValidChange?.(validation.valid, validation.normalized);
  }, [validation.valid, validation.normalized, onValidChange]);

  return (
    <div className={className}>
      <div className="relative">
        <Input
          id={id}
          value={value}
          placeholder={placeholder}
          spellCheck={false}
          autoComplete="off"
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => setTouched(true)}
          className={cn(
            'pr-24 font-mono text-xs',
            showError && 'border-destructive focus-visible:ring-destructive'
          )}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          {validation.valid ? (
            <Badge variant="success" className="gap-1 text-[10px]">
              <CheckCircle2 className="h-3 w-3" />
              {seiAddressTypeLabel(validation.type)}
            </Badge>
          ) : showError ? (
            <Badge variant="destructive" className="gap-1 text-[10px]">
              <AlertTriangle className="h-3 w-3" />
              Invalid
            </Badge>
          ) : null}
        </div>
      </div>
      {showError && (
        <p className="text-[11px] text-destructive mt-1.5">
          Enter a valid Sei address: native <span className="font-mono">sei1…</span> or EVM{' '}
          <span className="font-mono">0x…</span>.
        </p>
      )}
    </div>
  );
}
