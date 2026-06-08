"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, Check, Search, Wallet, FolderGit2 } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

type AdminProject = {
  id: number;
  name: string;
  description: string;
  githubUrl: string;
  contributorCount: number;
  openTasks: number;
  rewardPool: number;
  status: string;
  waveStatus?: 'joined' | 'not_joined';
  wavePoints?: number;
  createdAt: string;
};

export default function AdminDashboard() {
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AOS.init({
      once: true,
      duration: 800,
    });
    // Fetch projects from API (placeholder)
    const fetchProjects = async () => {
      setIsLoading(true);
      // Simulate API delay
      setTimeout(() => {
          const mockProjects = [
            {
              id: 1,
              name: 'Sei Wallet',
              description: 'A secure and user-friendly wallet for the Sei blockchain.',
              githubUrl: 'https://github.com/sei-wallet',
              contributorCount: 12,
              openTasks: 5,
              rewardPool: 15000,
              status: 'approved',
              waveStatus: 'joined',
              wavePoints: 375,
              createdAt: '2026-01-15',
            },
            {
              id: 2,
              name: 'Sei DEX',
              description: 'Decentralized exchange built on Sei for fast and low-cost trading.',
              githubUrl: 'https://github.com/sei-dex',
              contributorCount: 8,
              openTasks: 3,
              rewardPool: 22500,
              status: 'pending',
              waveStatus: 'not_joined',
              wavePoints: 0,
              createdAt: '2026-01-20',
            },
            {
              id: 3,
              name: 'Sei NFT Marketplace',
              description: 'Marketplace for Sei-based NFTs with advanced features.',
              githubUrl: 'https://github.com/sei-nft-marketplace',
              contributorCount: 15,
              openTasks: 7,
              rewardPool: 40000,
              status: 'rejected',
              waveStatus: 'not_joined',
              wavePoints: 0,
              createdAt: '2026-01-10',
            },
            {
              id: 4,
              name: 'Sei Dashboard',
              description: 'Analytics dashboard for Sei network metrics.',
              githubUrl: 'https://github.com/sei-dashboard',
              contributorCount: 5,
              openTasks: 12,
              rewardPool: 5000,
              status: 'pending',
              waveStatus: 'not_joined',
              wavePoints: 0,
              createdAt: '2026-01-25',
            },
          ];
        setProjects(mockProjects);
        setIsLoading(false);
      }, 1000);
    };

    fetchProjects();
  }, []);

  const filteredProjects = projects
    .filter((project) => {
      const matchesSearch = project.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' || project.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  const handleApprove = async (id: number) => {
    setProjects(
      projects.map((project) =>
        project.id === id
          ? {
              ...project,
              status: 'approved',
              waveStatus: 'joined',
              wavePoints: project.openTasks * 75,
            }
          : project
      )
    );
  };

  const handleReject = async (id: number) => {
    // In a real app, we would call the backend API to reject the project
    // For now, we'll update the local state
    setProjects(
      projects.map((project) =>
        project.id === id ? { ...project, status: 'rejected' } : project
      )
    );
  };

  const handleDelete = async (id: number) => {
    // In a real app, we would call the backend API to delete the project
    // For now, we'll remove it from local state
    setProjects(projects.filter((project) => project.id !== id));
  };

  // Stats calculation
  const totalProjects = projects.length;
  const approvedProjects = projects.filter((p) => p.status === 'approved').length;
  const totalContributors = projects.reduce(
    (sum, project) => sum + project.contributorCount,
    0
  );
  const totalRewards = projects.reduce(
    (sum, project) => sum + project.rewardPool,
    0
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#050505]">
        <div className="text-center">
          <div className="h-12 w-12 border-2 border-gradient-to-r border-[from:#ff4d6d_via:#d946ef_to:#7c3aed] rounded-full animate-spin"></div>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] text-black dark:text-white transition-all">
      {/* Admin Header */}
      <div className="bg-white dark:bg-white/10 shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="sei-gradient-text text-3xl font-bold">
                Admin Dashboard
              </h1>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                Manage SeiFlux projects and contributors
              </p>
            </div>
            <div className="flex flex-col md:flex-row md:space-x-4">
              <Link
                href="/submit-project"
                className="px-4 py-2 bg-gradient-to-r from-[#ff4d6d] via-[#d946ef] to:#7c3aed text-white text-sm font-medium rounded-lg hover:opacity-90 transition-all"
              >
                Submit New Project
              </Link>
              <Link
                href="/"
                className="mt-2 md:mt-0 px-4 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 text-sm font-medium rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-all"
              >
                Back to Site
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="p-6 bg-white dark:bg-white/10 rounded-xl shadow-md" data-aos="fade-up">
              <Users className="h-6 w-6 text-gradient mb-3" />
              <p className="text-zinc-600 dark:text-zinc-400 text-sm">Total Projects</p>
              <p className="text-2xl font-semibold">{totalProjects}</p>
            </div>
            <div className="p-6 bg-white dark:bg-white/10 rounded-xl shadow-md" data-aos="fade-up" data-aos-delay="200">
              <Check className="h-6 w-6 text-gradient mb-3" />
              <p className="text-zinc-600 dark:text-zinc-400 text-sm">Approved Projects</p>
              <p className="text-2xl font-semibold">{approvedProjects}</p>
            </div>
            <div className="p-6 bg-white dark:bg-white/10 rounded-xl shadow-md" data-aos="fade-up" data-aos-delay="400">
              <Users className="h-6 w-6 text-gradient mb-3" />
              <p className="text-zinc-600 dark:text-zinc-400 text-sm">Total Contributors</p>
              <p className="text-2xl font-semibold">{totalContributors}</p>
            </div>
            <div className="p-6 bg-white dark:bg-white/10 rounded-xl shadow-md" data-aos="fade-up" data-aos-delay="600">
              <Wallet className="h-6 w-6 text-gradient mb-3" />
              <p className="text-zinc-600 dark:text-zinc-400 text-sm">Total Points Pool</p>
              <p className="text-2xl font-semibold">{totalRewards} Points</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="relative w-full md:w-48">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500 dark:text-zinc-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search projects..."
                className="w-full px-4 py-3 pl-10 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gradient-to-r focus:from-[#ff4d6d] focus:via-[#d946ef] focus:to-[#7c3aed] text-zinc-800 dark:text-zinc-200"
              />
            </div>
            <div className="relative w-full md:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 pl-10 pr-8 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gradient-to-r focus:from-[#ff4d6d] focus:via-[#d946ef] focus:to-[#7c3aed] text-zinc-800 dark:text-zinc-200 appearance-none bg-white dark:bg-white/10"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Table */}
      <div className="px-4 py-6">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-white/10 rounded-xl shadow-md">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-700">
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Project
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Contributors
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Approval
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Wave Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Wave Points
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-zinc-500 dark:text-zinc-400">
                    No projects found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50" data-aos="fade-up">
                    <td className="px-6 py-4 flex items-center space-x-3">
                      <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-[#ff4d6d20] via-[#d946ef10] to:#7c3aed20 rounded-full flex items-center justify-center">
                        <FolderGit2 className="h-5 w-5 text-gradient" />
                      </div>
                      <div>
                        <h3 className="font-medium text-zinc-800 dark:text-zinc-100">{project.name}</h3>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 truncate max-w-[200px]">
                          {project.githubUrl}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                      {project.contributorCount}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        project.status === 'approved'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-100'
                          : project.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-100'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-100'
                      }`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-700 dark:text-zinc-200">
                      {project.status === 'approved' ? (project.waveStatus === 'joined' ? 'Joined' : 'Not joined') : '—'}
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-700 dark:text-zinc-200">
                      {project.status === 'approved' && project.waveStatus === 'joined' ? `${project.wavePoints ?? 0} pts` : '—'}
                    </td>
                    <td className="px-6 py-4 flex space-x-3">
                      <button
                        onClick={() => handleApprove(project.id)}
                        disabled={project.status === 'approved'}
                        className={`px-3 py-1 text-xs font-medium ${project.status === 'approved' ? 'bg-zinc-200 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400' : 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-100 dark:hover:bg-green-800/20'} rounded-lg`}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(project.id)}
                        disabled={project.status === 'rejected'}
                        className={`px-3 py-1 text-xs font-medium ${project.status === 'rejected' ? 'bg-zinc-200 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400' : 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-100 dark:hover:bg-red-800/20'} rounded-lg`}
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="px-3 py-1 text-xs font-medium bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-900/20 dark:text-zinc-200 dark:hover:bg-zinc-800/20 rounded-lg"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}