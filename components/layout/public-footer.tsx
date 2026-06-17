import * as React from 'react';
import Link from 'next/link';
import { Zap } from 'lucide-react';

const FOOTER_LINKS = {
  Platform: [
    { label: 'Features', href: '/features' },
    { label: 'Projects', href: '/projects' },
  ],
  Developers: [
    { label: 'Sign Up', href: '/sign-up' },
    { label: 'Sign In', href: '/sign-in' },
  ],
  Ecosystem: [
    { label: 'Sei Network', href: '#' },
    { label: 'Documentation', href: '#' },
  ],
};

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-card/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
                <Zap className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
              <span className="font-bold text-sm text-foreground">SEI Builders Hub</span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-[200px]">
              The platform for Sei blockchain builders and contributors.
            </p>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">
                {category}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border/50 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} SEI Builders Hub. Built on Sei.
          </p>
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-muted-foreground">Sei Network</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
