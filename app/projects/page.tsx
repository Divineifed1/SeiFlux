"use client";

import Link from 'next/link';
import { Search, Users, Trophy, ArrowRight, Wallet } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect, useState } from 'react';

type ProjectListItem = {
  id: number;
  name: string;
  description: string;
  githubUrl: string;
  contributorCount: number;
  openTasks: number;
  rewardPool: number;
  status: string;
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectListItem[]>([]);

  useEffect(() => {
    AOS.init({
      once: true,
      duration: 800,
    });
    // Fetch projects from API (placeholder)
    const fetchProjects = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
        const response = await fetch(`${backendUrl}/api/projects`);
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] text-black dark:text-white transition-all">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="sei-gradient-text text-4xl font-bold" data-aos="fade-up">
            Discover Sei Projects
          </h1>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400" data-aos="fade-up" data-aos-delay="200">
            Browse innovative projects in the Sei ecosystem looking for contributors like you.
          </p>
          <div className="mt-6 flex max-w-xl" data-aos="fade-up" data-aos-delay="400">
            <input
              type="text"
              placeholder="Search projects..."
              className="flex-1 px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-gradient-to-r focus:from-[#ff4d6d] focus:via-[#d946ef] focus:to-[#7c3aed] text-zinc-800 dark:text-zinc-200"
            />
            <button
              className="px-6 py-3 bg-gradient-to-r from-[#ff4d6d] via-[#d946ef] to-[#7c3aed] text-white font-medium rounded-r-lg hover:opacity-90 transition-all"
            >
              <Search className="mr-2 h-4 w-4" />
              Search
            </button>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="group block bg-white dark:bg-white/10 rounded-xl p-6 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1" data-aos="fade-up"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold sei-gradient-text">{project.name}</h3>
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
                <p className="text-zinc-600 dark:text-zinc-400 line-clamp-3">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-zinc-500 dark:text-zinc-400">
                  <div className="flex items-center">
                    <Users className="mr-1 h-4 w-4" />
                    <span>{project.contributorCount} Contributors</span>
                  </div>
                  <div className="flex items-center">
                    <Trophy className="mr-1 h-4 w-4" />
                    <span>{project.openTasks} Open Tasks</span>
                  </div>
                  <div className="flex items-center">
                    <Wallet className="mr-1 h-4 w-4" />
                    <span>{project.rewardPool} Points</span>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-700">
                  <Link href={`/projects/${project.id}`} className="text-gradient-to-r text-sm font-medium from-[#ff4d6d] via-[#d946ef] to-[#7c3aed] hover:underline">
                    View Project Details
                    <ArrowRight className="ml-2 h-3 w-3" />
                  </Link>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// We need to import ArrowRight from lucide-react, but we didn't. Let's fix by adding it to the import.
// We'll edit the import line to include ArrowRight.