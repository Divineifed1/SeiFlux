import Link from 'next/link';
import { ArrowLeft, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="relative z-10 text-center max-w-md">
        {/* Logo */}
        <Link href="/" className="inline-flex items-center gap-2.5 mb-12">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Zap className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-sm text-foreground">SEI Builders Hub</span>
        </Link>

        {/* 404 */}
        <div className="mb-6">
          <p className="text-[120px] font-black text-foreground/5 leading-none select-none">
            404
          </p>
          <div className="-mt-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">Page not found</h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
              Let&apos;s get you back on track.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button asChild>
            <Link href="/dashboard">
              Go to Dashboard
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </Link>
          </Button>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
          <Link href="/projects" className="hover:text-foreground transition-colors">Browse Projects</Link>
          <span className="text-muted-foreground/30">·</span>
          <Link href="/features" className="hover:text-foreground transition-colors">Features</Link>
          <span className="text-muted-foreground/30">·</span>
          <Link href="/sign-in" className="hover:text-foreground transition-colors">Sign In</Link>
        </div>
      </div>
    </div>
  );
}
