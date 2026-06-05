"use client";

import Image from 'next/image';
import Link from 'next/link';
import { FolderGit2, Users, Trophy, Wallet, Code2, ShieldCheck } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect, useState } from 'react';

type ProjectTask = {
  id: number
  title: string
  reward: number
  difficulty: string
}

type ProjectContributor = {
  id: number
  name: string
  avatar: string
  contributions: number
  rewards: number
}

type Project = {
  id: number
  name: string
  description: string
  githubUrl: string
  contributorCount: number
  openTasks: number
  rewardPool: number
  status: string
  createdAt: string
  website: string
  docs: string
  tasks: ProjectTask[]
  contributors: ProjectContributor[]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProjectDetailPage(props: any) {
  const { params } = props;
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AOS.init({
      once: true,
      duration: 800,
    });
    // Fetch project from API (placeholder)
    const fetchProject = async () => {
      // In a real app, we would call the backend API with params.id
      // For now, we'll use mock data based on id
      setIsLoading(true);
      // Simulate API delay
      setTimeout(() => {
        const mockProject = {
          id: parseInt(params.id),
          name: 'Sei Wallet',
          description: 'A secure and user-friendly wallet for the Sei blockchain with multi-signature support, hardware wallet integration, and staking capabilities.',
          githubUrl: 'https://github.com/sei-wallet',
          contributorCount: 12,
          openTasks: 5,
          rewardPool: 1000,
          status: 'approved',
          createdAt: '2026-01-15',
          website: 'https://sei-wallet.com',
          docs: 'https://docs.sei-wallet.com',
          tasks: [
            { id: 1, title: 'Implement biometric authentication', reward: 75, difficulty: 'medium' },
            { id: 2, title: 'Add support for Ledger Nano X', reward: 100, difficulty: 'hard' },
            { id: 3, title: 'Create user guide for staking feature', reward: 50, difficulty: 'easy' },
          ],
          contributors: [
            { id: 1, name: 'Alice', avatar: 'https://i.pravatar.cc/150?img=1', contributions: 5, rewards: 250 },
            { id: 2, name: 'Bob', avatar: 'https://i.pravatar.cc/150?img=2', contributions: 3, rewards: 150 },
            { id: 3, name: 'Charlie', avatar: 'https://i.pravatar.cc/150?img=3', contributions: 8, rewards: 400 },
          ],
        };
        setProject(mockProject);
        setIsLoading(false);
      }, 1000);
    };

    fetchProject();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#050505]">
        <div className="text-center">
          <div className="h-12 w-12 border-2 border-gradient-to-r border-[from:#ff4d6d_via:#d946ef_to:#7c3aed] rounded-full animate-spin"></div>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#050505]">
        <p className="text-zinc-500 dark:text-zinc-400">Project not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] text-black dark:text-white transition-all">
      {/* Project Banner */}
      <section className="relative py-16 bg-gradient-to-b from-white to-slate-50 dark:from-[#09090b] dark:to-[#050505] overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="h-full w-full bg-gradient-to-tr from-[#ff4d6d20] via-[#d946ef10] to-[#7c3aed20]"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-start gap-12">
            <div className="flex-shrink-0 lg:w-1/3">
              <div className="relative h-64 w-full">
                <Image
                  src="https://i.pravatar.cc/500?img=1"
                  alt={`${project.name} banner`}
                  fill
                  className="object-cover rounded-lg shadow-lg"
                  unoptimized
                />
              </div>
            </div>
            <div className="space-y-6">
              <h1 className="sei-gradient-text text-4xl font-bold" data-aos="fade-up">
                {project.name}
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400 text-lg" data-aos="fade-up" data-aos-delay="200">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-4" data-aos="fade-up" data-aos-delay="400">
                <Link
                  href={project.website}
                  className="px-4 py-2 bg-gradient-to-r from-[#ff4d6d] via-[#d946ef] to-[#7c3aed] text-white text-sm font-medium rounded-full hover:opacity-90 transition-all"
                >
                  Visit Website
                </Link>
                <Link
                  href={project.docs}
                  className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 text-sm font-medium rounded-full hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-all"
                >
                  Documentation
                </Link>
                <Link
                  href={project.githubUrl}
                  className="flex items-center px-4 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 text-sm font-medium rounded-full hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-all"
                >
                  <FolderGit2 className="mr-2 h-4 w-4" />
                  View on GitHub
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Stats */}
      <section className="py-12 bg-white dark:bg-[#0f172a]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 bg-white dark:bg-white/10 rounded-xl shadow-md" data-aos="fade-up">
              <Users className="h-6 w-6 text-gradient mb-2" />
              <p className="text-zinc-600 dark:text-zinc-400 text-sm">Contributors</p>
              <p className="text-2xl font-semibold">{project.contributorCount}</p>
            </div>
            <div className="p-4 bg-white dark:bg-white/10 rounded-xl shadow-md" data-aos="fade-up" data-aos-delay="200">
              <Trophy className="h-6 w-6 text-gradient mb-2" />
              <p className="text-zinc-600 dark:text-zinc-400 text-sm">Open Tasks</p>
              <p className="text-2xl font-semibold">{project.openTasks}</p>
            </div>
            <div className="p-4 bg-white dark:bg-white/10 rounded-xl shadow-md" data-aos="fade-up" data-aos-delay="400">
              <Wallet className="h-6 w-6 text-gradient mb-2" />
              <p className="text-zinc-600 dark:text-zinc-400 text-sm">Points Pool</p>
              <p className="text-2xl font-semibold">{project.rewardPool} Points</p>
            </div>
            <div className="p-4 bg-white dark:bg-white/10 rounded-xl shadow-md" data-aos="fade-up" data-aos-delay="600">
              <ShieldCheck className="h-6 w-6 text-gradient mb-2" />
              <p className="text-zinc-600 dark:text-zinc-400 text-sm">Status</p>
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                project.status === 'approved'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-100'
                  : project.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-100'
                  : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-100'
              }`}>
                {project.status}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Tasks Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="sei-gradient-text text-3xl font-bold mb-8" data-aos="fade-up">
            Open Tasks
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {project.tasks.map((task) => (
              <div
                key={task.id}
                className="bg-white dark:bg-white/10 rounded-xl p-6 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1" data-aos="fade-up"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    <Code2 className="h-5 w-5 text-gradient" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{task.title}</h3>
                    <p className="mt-2 text-zinc-600 dark:text-zinc-400 text-sm">
                      Reward: {task.reward} points • Difficulty: {task.difficulty}
                    </p>
                    <button
                      className="mt-4 px-4 py-2 bg-gradient-to-r from-[#ff4d6d] via-[#d946ef] to-[#7c3aed] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-all"
                    >
                      Contribute
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contributors Section */}
      <section className="py-12 bg-gradient-to-b from-white to-slate-50 dark:from-[#09090b] dark:to-[#050505]">
        <div className="container mx-auto px-4">
          <h2 className="sei-gradient-text text-3xl font-bold mb-8" data-aos="fade-up">
            Contributors
          </h2>
          <div className="grid gap-6 md:grid-cols-4">
            {project.contributors.map((contributor) => (
              <div
                key={contributor.id}
                className="text-center space-y-3" data-aos="fade-up"
              >
                <div className="relative h-12 w-12 mx-auto rounded-full overflow-hidden border-4 border-gradient-to-r border-[from:#ff4d6d_via:#d946ef_to:#7c3aed]">
                  <Image
                    src={contributor.avatar}
                    alt={contributor.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <h3 className="font-semibold">{contributor.name}</h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                  {contributor.contributions} contributions • {contributor.rewards} points earned
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 text-center">
        <div className="container mx-auto px-4">
          <h2 className="sei-gradient-text text-3xl font-bold mb-6" data-aos="fade-up">
            Ready to contribute to {project.name}?
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-8 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="200">
            Join the community of contributors helping to build the next generation of Sei ecosystem projects.
          </p>
          <Link
            href="/"
            className="px-8 py-4 bg-gradient-to-r from-[#ff4d6d] via-[#d946ef] to-[#7c3aed] text-white font-medium rounded-lg hover:opacity-90 transition-all transform hover:-translate-y-1 inline-flex items-center"
            data-aos="fade-up" data-aos-delay="400"
          >
            <Users className="mr-3 h-4 w-4" />
            Back to Projects
          </Link>
        </div>
      </section>
    </div>
  );
}