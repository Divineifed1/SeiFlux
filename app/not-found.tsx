export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#050505] text-black dark:text-white">
      <div className="text-center p-8">
        <h1 className="text-4xl font-bold sei-gradient-text mb-4">Page not found</h1>
        <p className="text-zinc-600 dark:text-zinc-400">The page you are looking for does not exist.</p>
      </div>
    </div>
  );
}
