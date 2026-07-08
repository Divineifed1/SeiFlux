'use client';
import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Zap, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/store/auth-store';
import { WalletButton } from '@/components/ui/wallet-button';
import { WaveBanner } from '@/components/wave/wave-banner';

const NAV_LINKS = [
  { label: 'Features', href: '/features' },
  { label: 'Projects', href: '/projects' },
];

export function PublicHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const { isAuthenticated, user } = useAuthStore();

  React.useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-background/90 backdrop-blur-md border-b border-border/50 shadow-sm'
          : 'bg-transparent'
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-sm text-foreground tracking-tight">
              SeiFlux
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3 py-2 text-sm rounded-md transition-colors',
                  pathname === link.href
                    ? 'text-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-2">
            <WalletButton />
            {isAuthenticated ? (
              <Button size="sm" asChild className="gap-1.5">
                <Link href="/dashboard">
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  Dashboard
                </Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/sign-in">Sign in</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/sign-up">Get started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md">
          <div className="px-4 py-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2 text-sm rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-border flex flex-col gap-2">
              <WalletButton className="w-full" />
              {isAuthenticated ? (
                <Button size="sm" asChild className="gap-1.5">
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                    <LayoutDashboard className="h-3.5 w-3.5" />
                    Go to Dashboard
                  </Link>
                </Button>
              ) : (
                <>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/sign-in">Sign in</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/sign-up">Get started</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      <WaveBanner />
    </header>
  );
}
