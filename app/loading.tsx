import { Zap } from 'lucide-react';

export default function RootLoading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="absolute inset-0 rounded-xl bg-primary animate-ping opacity-20" />
        </div>
        <p className="text-xs text-muted-foreground animate-pulse">Loading…</p>
      </div>
    </div>
  );
}
