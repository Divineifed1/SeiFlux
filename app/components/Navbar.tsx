import Image from 'next/image';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  return (
    <header className="w-full bg-white/80 dark:bg-[#0b0b0b]/80 backdrop-blur sticky top-0 z-40 border-b border-zinc-200 dark:border-zinc-800">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/seiflux logo.png"
            alt="SeiFlux logo"
            width={10}
            height={20}
            className="rounded-full"
          />
          <span className="text-xl font-bold sei-gradient-text">SeiFlux</span>
        </Link>
        <nav className="flex items-center space-x-4">
          <Link href="/projects" className="text-sm text-zinc-700 dark:text-zinc-200 hover:gradient-to-r from-[#ff4d6d] via-[#d946ef] to-[#7c3aed] text-transparent bg-clip-text">
            Projects
          </Link>
          <Link href="/submit-project" className="text-sm text-zinc-700 dark:text-zinc-200 hover:gradient-to-r from-[#ff4d6d] via-[#d946ef] to-[#7c3aed] text-transparent bg-clip-text">
            Submit
          </Link>
          <Link href="/admin" className="text-sm text-zinc-700 dark:text-zinc-200 hover:gradient-to-r from-[#ff4d6d] via-[#d946ef] to-[#7c3aed] text-transparent bg-clip-text">
            Admin
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
