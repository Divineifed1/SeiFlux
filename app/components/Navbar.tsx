'use client';

import { useState } from 'react';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import { Menu, X, Bell, Wallet, LogOut } from 'lucide-react';
import { useAuth, isAdmin } from '../contexts/AuthContext';
import * as Avatar from '@radix-ui/react-avatar';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, login, logout } = useAuth();

  const baseNavLinks = [
    { href: '/projects', label: 'Projects' },
    { href: '/waves', label: 'Waves' },
    { href: '/submit-project', label: 'Submit Project' },
  ];

  const navLinks = isAdmin(user)
    ? [...baseNavLinks, { href: '/admin', label: 'Admin' }]
    : baseNavLinks;

  const isAdminUser = isAdmin(user);

  return (
    <header className="w-full bg-white/80 dark:bg-[#0b0b0b]/80 backdrop-blur sticky top-0 z-40 border-b border-zinc-200 dark:border-zinc-800">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="text-xl font-bold sei-gradient-text">SeiFlux</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:sei-gradient-text transition-all"
            >
              {link.label}
            </Link>
          ))}

          {isAuthenticated && user ? (
            <div className="flex items-center gap-4 ml-4">
              <button className="relative p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                <Bell className="h-5 w-5 text-zinc-700 dark:text-zinc-200" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-[#ff4d6d] via-[#d946ef] to-[#7c3aed] text-white text-sm font-medium hover:opacity-90 transition-all">
                <Wallet className="h-4 w-4" />
                Connect Wallet
              </button>
              <div className="relative group">
                <button className="flex items-center gap-2">
                    <Avatar.Root className="h-8 w-8 rounded-full overflow-hidden border-2 border-zinc-200 dark:border-zinc-700">
                      <Avatar.Image src={user.avatar_url} alt={user.login} />
                      <Avatar.Fallback className="flex items-center justify-center h-full w-full bg-gradient-to-r from-[#ff4d6d] via-[#d946ef] to-[#7c3aed] text-white text-xs font-medium">
                        {user.login.charAt(0).toUpperCase()}
                      </Avatar.Fallback>
                    </Avatar.Root>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-700">
                    <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100">{user.name || user.login}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">@{user.login}</p>
                  </div>
                  <div className="py-1">
                    {isAdminUser && (
                      <Link href="/admin" className="block px-4 py-2 text-sm text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={logout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={login}
              className="ml-4 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#ff4d6d] via-[#d946ef] to-[#7c3aed] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-all"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              Sign in with GitHub
            </button>
          )}

          <ThemeToggle />
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-[#0b0b0b] border-b border-zinc-200 dark:border-zinc-800 shadow-lg">
          <nav className="container mx-auto px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:sei-gradient-text transition-all py-2"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-zinc-200 dark:border-zinc-700">
              {isAuthenticated && user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 py-2">
                    <Avatar.Root className="h-8 w-8 rounded-full overflow-hidden border-2 border-zinc-200 dark:border-zinc-700">
                      <Avatar.Image src={user.avatar_url} alt={user.login} />
                      <Avatar.Fallback className="flex items-center justify-center h-full w-full bg-gradient-to-r from-[#ff4d6d] via-[#d946ef] to-[#7c3aed] text-white text-xs font-medium">
                        {user.login.charAt(0).toUpperCase()}
                      </Avatar.Fallback>
                    </Avatar.Root>
                    <div>
                      <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100">{user.name || user.login}</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">@{user.login}</p>
                    </div>
                  </div>
                  {isAdminUser && (
                    <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm font-medium text-zinc-700 dark:text-zinc-200 py-2">
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                    className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-200 py-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { login(); setIsMobileMenuOpen(false); }}
                  className="flex items-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-[#ff4d6d] via-[#d946ef] to-[#7c3aed] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-all"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  Sign in with GitHub
                </button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
