export default function Footer() {
  return (
    <footer className="w-full bg-white dark:bg-[#050505] border-t border-zinc-200 dark:border-zinc-800 mt-12">
      <div className="container mx-auto px-4 py-8 text-center text-zinc-600 dark:text-zinc-400">
        <p className="mb-2">SeiFlux — Community contributions rewarded with points.</p>
        <p className="text-sm">© {new Date().getFullYear()} SeiFlux. All rights reserved.</p>
      </div>
    </footer>
  );
}
