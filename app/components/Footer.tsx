'use client';

import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { href: '/projects', label: 'Projects' },
    { href: '/waves', label: 'Waves' },
    { href: '/submit-project', label: 'Submit Project' },
    { href: '/admin', label: 'Admin' },
  ];

  return (
    <footer className="w-full bg-white dark:bg-[#050505] border-t border-zinc-200 dark:border-zinc-800 mt-12">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <p className="text-xl font-bold sei-gradient-text mb-3">SeiFlux</p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-sm">
              Community contributions rewarded with points. Powering open-source collaboration on Sei.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-4 uppercase tracking-wider">
              Navigation
            </h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-600 dark:text-zinc-400 hover:sei-gradient-text transition-all"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-4 uppercase tracking-wider">
              Connect
            </h3>
            <div className="flex gap-4">
              <Link
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-600 dark:text-zinc-400 hover:text-gradient-to-r hover:from-[#ff4d6d] hover:via-[#d946ef] hover:to-[#7c3aed] transition-all"
              >
                <ExternalLink className="h-5 w-5" />
              </Link>
              <Link
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-600 dark:text-zinc-400 hover:text-gradient-to-r hover:from-[#ff4d6d] hover:via-[#d946ef] hover:to-[#7c3aed] transition-all"
              >
                <ExternalLink className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
            © {currentYear} SeiFlux. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
