import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  return (
    <header className="w-full bg-white/80 dark:bg-[#0b0b0b]/80 backdrop-blur sticky top-0 z-40 border-b border-zinc-200 dark:border-zinc-800">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold sei-gradient-text">
          SeiFlux
        </Link>
        <nav className="flex items-center space-x-4">
          <Link href="/projects" className="text-sm text-zinc-700 dark:text-zinc-200 hover:underline">
            Projects
          </Link>
          <Link href="/submit-project" className="text-sm text-zinc-700 dark:text-zinc-200 hover:underline">
            Submit
          </Link>
          <Link href="/admin" className="text-sm text-zinc-700 dark:text-zinc-200 hover:underline">
            Admin
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
