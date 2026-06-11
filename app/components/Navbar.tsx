'use client';

import { useState } from 'react';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import { Menu, X, Bell, Wallet } from 'lucide-react';
import { useAuth, isAdmin } from '../contexts/AuthContext';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  const baseNavLinks = [
    { href: '/projects', label: 'Projects' },
    { href: '/waves', label: 'Waves' },
    { href: '/submit-project', label: 'Submit Project' },
  ];

  const navLinks = isAdmin(user)
    ? [...baseNavLinks, { href: '/admin', label: 'Admin' }]
    : baseNavLinks;

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

          <div className="flex items-center gap-4 ml-4">
            <button className="relative p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <Bell className="h-5 w-5 text-zinc-700 dark:text-zinc-200" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-[#ff4d6d] via-[#d946ef] to-[#7c3aed] text-white text-sm font-medium hover:opacity-90 transition-all">
              <Wallet className="h-4 w-4" />
              Connect Wallet
            </button>
          </div>

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
            <div className="pt-3 border-t border-zinc-200 dark:border-zinc-700 space-y-2">
              <button className="relative w-full flex items-center gap-2 p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                <Bell className="h-5 w-5 text-zinc-700 dark:text-zinc-200" />
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">Notifications</span>
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="flex items-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-[#ff4d6d] via-[#d946ef] to-[#7c3aed] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-all">
                <Wallet className="h-4 w-4" />
                Connect Wallet
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
