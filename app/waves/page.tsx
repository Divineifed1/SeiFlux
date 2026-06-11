'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Calendar, Flame, Trophy, Zap, ArrowRight } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

type Wave = {
  id: string;
  name: string;
  description: string;
  tags: string[];
  startsAt: string;
  endsAt: string;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  totalPoints: number;
  participantCount: number;
  projectIds: string[];
  createdAt: string;
};

const MOCK_WAVES: Wave[] = [
  {
    id: '1',
    name: 'Security Wave',
    description: 'Focus on security audits, bug fixes, and security tooling across Sei projects.',
    tags: ['security', 'defi'],
    startsAt: new Date(Date.now() + 86400000 * 2).toISOString(),
    endsAt: new Date(Date.now() + 86400000 * 9).toISOString(),
    status: 'upcoming',
    totalPoints: 2500,
    participantCount: 0,
    projectIds: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'DeFi Wave',
    description: 'Build the next generation of decentralized finance primitives on Sei.',
    tags: ['defi', 'developers'],
    startsAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    endsAt: new Date(Date.now() + 86400000 * 4).toISOString(),
    status: 'active',
    totalPoints: 5000,
    participantCount: 0,
    projectIds: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'UI Wave',
    description: 'Improve user experience, design systems, and accessibility across the ecosystem.',
    tags: ['design', 'ui'],
    startsAt: new Date(Date.now() - 86400000 * 20).toISOString(),
    endsAt: new Date(Date.now() - 86400000 * 13).toISOString(),
    status: 'completed',
    totalPoints: 1800,
    participantCount: 0,
    projectIds: [],
    createdAt: new Date().toISOString(),
  },
];

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getDaysLeft(startIso: string, endIso: string) {
  const now = new Date();
  const end = new Date(endIso);
  const start = new Date(startIso);
  if (now < start) {
    const diff = start.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }
  const diff = end.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export default function WavesPage() {
  const [waves, setWaves] = useState<Wave[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    AOS.init({ once: true, duration: 800 });
    setWaves(MOCK_WAVES);
  }, []);

  const filteredWaves = waves.filter((wave) => {
    const matchesStatus = selectedStatus === 'all' || wave.status === selectedStatus;
    const matchesSearch =
      wave.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wave.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] text-black dark:text-white transition-all">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10" data-aos="fade-up">
          <div>
            <h1 className="sei-gradient-text text-4xl font-bold">FluxWaves</h1>
            <p className="mt-3 text-zinc-600 dark:text-zinc-400 max-w-xl">
              Monthly themed waves run for 7 days. Approved projects join the active wave,
              contributors complete tasks, and rewards are disributed after the wave ends.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-700 px-4 py-2 text-sm text-zinc-700 dark:text-zinc-200">
            <Zap className="h-4 w-4 text-[#d946ef]" />
            <span>Rewards are points-based per task</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8" data-aos="fade-up" data-aos-delay="200">
          <div className="relative flex-1">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search waves..."
              className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-white/[0.07] px-4 py-3 text-sm text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-500 dark:placeholder:text-zinc-400"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-white/[0.07] px-3 py-3 text-sm text-zinc-800 dark:text-zinc-100"
            >
              <option value="all">All statuses</option>
              <option value="upcoming">Upcoming</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {filteredWaves.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700 py-16 text-center" data-aos="fade-up">
            <p className="text-zinc-500 dark:text-zinc-400">No waves match this filter.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredWaves.map((wave) => {
              const daysLeft = getDaysLeft(wave.startsAt, wave.endsAt);
              const isActive = wave.status === 'active';
              const isUpcoming = wave.status === 'upcoming';

              return (
                <div
                  key={wave.id}
                  className="group relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-white/[0.07] p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                  data-aos="fade-up"
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#ff4d6d] via-[#d946ef] to-[#7c3aed]" />
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{wave.name}</h3>
                      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3">{wave.description}</p>
                    </div>
                    <span
                      className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${
                        isActive
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-100'
                          : isUpcoming
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-100'
                          : wave.status === 'completed'
                          ? 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-100'
                      }`}
                    >
                      {wave.status}
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3 text-xs text-zinc-600 dark:text-zinc-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(wave.startsAt)} – {formatDate(wave.endsAt)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Flame className="h-4 w-4" />
                      <span>{daysLeft} day{daysLeft === 1 ? '' : 's'} left</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4" />
                      <span>{wave.totalPoints.toLocaleString()} points</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      <span>{wave.participantCount.toLocaleString()} participants</span>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {wave.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-zinc-200 dark:border-zinc-700 px-3 py-1 text-xs text-zinc-700 dark:text-zinc-200"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <Link
                      href={`/waves/${wave.id}`}
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#ff4d6d] via-[#d946ef] to-[#7c3aed] px-4 py-2 text-xs font-semibold text-white transition-all hover:opacity-90"
                    >
                      View Wave
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
