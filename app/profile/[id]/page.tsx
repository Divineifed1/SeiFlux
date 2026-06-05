"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Users, Trophy, Wallet, Clock, Code2, ArrowRight, FolderGit2 } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect, useState } from 'react';

type Contribution = {
  id: number
  projectName: string
  task: string
  reward: number
  date: string
  status: string
}

type ProjectContribution = {
  id: number
  name: string
  contributions: number
  rewards: number
}

type Profile = {
  id: number
  name: string
  avatar: string
  walletAddress: string
  reputationScore: number
  totalContributions: number
  rewardsEarned: number
  contributionHistory: Contribution[]
  projectsContributed: ProjectContribution[]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProfilePage(props: any) {
  const { params } = props;
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AOS.init({
      once: true,
      duration: 800,
    });
    // Fetch profile from API (placeholder)
    const fetchProfile = async () => {
      setIsLoading(true);
      // Simulate API delay
      setTimeout(() => {
        // Mock profile data based on id
        const mockProfile = {
          id: parseInt(params.id),
          name: 'Alex Morgan',
          avatar: 'https://i.pravatar.cc/150?img=5',
          walletAddress: '0x742d35Cc6634C0532925a3b8D4C0532950532950',
          reputationScore: 850,
          totalContributions: 24,
          rewardsEarned: 1250,
          contributionHistory: [
            {
              id: 1,
              projectName: 'Sei Wallet',
              task: 'Implement biometric authentication',
              reward: 50,
              date: '2026-05-10',
              status: 'completed',
            },
            {
              id: 2,
              projectName: 'Sei DEX',
              task: 'Add limit order functionality',
              reward: 75,
              date: '2026-04-22',
              status: 'completed',
            },
            {
              id: 3,
              projectName: 'Sei NFT Marketplace',
              task: 'Create smart contract for royalties',
              reward: 100,
              date: '2026-04-05',
              status: 'completed',
            },
            {
              id: 4,
              projectName: 'Sei Wallet',
              task: 'Add hardware wallet support (Ledger)',
              reward: 75,
              date: '2026-03-18',
              status: 'completed',
            },
            {
              id: 5,
              projectName: 'Sei Dashboard',
              task: 'Design UI for staking overview',
              reward: 40,
              date: '2026-02-28',
              status: 'completed',
            },
          ],
          projectsContributed: [
            { id: 1, name: 'Sei Wallet', contributions: 5, rewards: 250 },
            { id: 2, name: 'Sei DEX', contributions: 3, rewards: 225 },
            { id: 3, name: 'Sei NFT Marketplace', contributions: 2, rewards: 200 },
            { id: 4, name: 'Sei Dashboard', contributions: 1, rewards: 40 },
          ],
        };
        setProfile(mockProfile);
        setIsLoading(false);
      }, 1000);
    };

    fetchProfile();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#050505]">
        <div className="text-center">
          <div className="h-12 w-12 border-2 border-gradient-to-r border-[from:#ff4d6d_via:#d946ef_to:#7c3aed] rounded-full animate-spin"></div>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#050505]">
        <p className="text-zinc-500 dark:text-zinc-400">Profile not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] text-black dark:text-white transition-all">
      {/* Profile Header */}
      <section className="relative py-20 bg-gradient-to-b from-white to-slate-50 dark:from-[#09090b] dark:to-[#050505] overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="h-full w-full bg-gradient-to-tr from-[#ff4d6d20] via-[#d946ef10] to:#7c3aed20"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-start gap-12">
            <div className="flex-shrink-0 lg:w-1/3">
              <div className="relative h-64 w-full">
                <Image
                  src={profile.avatar}
                  alt={`${profile.name}'s avatar`}
                  fill
                  className="object-cover rounded-lg shadow-lg"
                  unoptimized
                />
                <div className="absolute bottom-0 right-0 h-10 w-10 bg-gradient-to-r from-[#ff4d6d] via-[#d946ef] to:#7c3aed rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <h1 className="sei-gradient-text text-4xl font-bold" data-aos="fade-up">
                {profile.name}
              </h1>
              <div className="flex flex-wrap gap-4" data-aos="fade-up" data-aos-delay="200">
                <div className="flex items-center space-x-2">
                  <Wallet className="h-5 w-5 text-gradient" />
                  <span className="text-zinc-600 dark:text-zinc-400">{profile.walletAddress}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FolderGit2 className="h-5 w-5 text-gradient" />
                  <span className="text-zinc-600 dark:text-zinc-400">@alexmorgan_dev</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-4 text-center">
            <div className="p-6 bg-white dark:bg-white/10 rounded-xl shadow-md" data-aos="fade-up">
              <Trophy className="h-6 w-6 text-gradient mb-3" />
              <p className="text-zinc-600 dark:text-zinc-400 text-sm">Reputation Score</p>
              <p className="text-2xl font-semibold">{profile.reputationScore}</p>
            </div>
            <div className="p-6 bg-white dark:bg-white/10 rounded-xl shadow-md" data-aos="fade-up" data-aos-delay="200">
              <Users className="h-6 w-6 text-gradient mb-3" />
              <p className="text-zinc-600 dark:text-zinc-400 text-sm">Total Contributions</p>
              <p className="text-2xl font-semibold">{profile.totalContributions}</p>
            </div>
            <div className="p-6 bg-white dark:bg-white/10 rounded-xl shadow-md" data-aos="fade-up" data-aos-delay="400">
              <Wallet className="h-6 w-6 text-gradient mb-3" />
              <p className="text-zinc-600 dark:text-zinc-400 text-sm">Rewards Earned</p>
              <p className="text-2xl font-semibold">{profile.rewardsEarned} Points</p>
            </div>
            <div className="p-6 bg-white dark:bg-white/10 rounded-xl shadow-md" data-aos="fade-up" data-aos-delay="600">
              <Clock className="h-6 w-6 text-gradient mb-3" />
              <p className="text-zinc-600 dark:text-zinc-400 text-sm">Member Since</p>
              <p className="text-2xl font-semibold">Jan 2026</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contribution History */}
      <section className="py-12 bg-gradient-to-b from-white to-slate-50 dark:from-[#09090b] dark:to:#050505">
        <div className="container mx-auto px-4">
          <h2 className="sei-gradient-text text-3xl font-bold mb-8" data-aos="fade-up">
            Contribution History
          </h2>
          <div className="space-y-6">
            {profile.contributionHistory.map((contribution) => (
              <div
                key={contribution.id}
                className="bg-white dark:bg-white/10 rounded-xl p-6 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1" data-aos="fade-up"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <Code2 className="h-5 w-5 text-gradient" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold">{contribution.task}</h3>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        contribution.status === 'completed'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-100'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-100'
                      }`}>
                        {contribution.status}
                      </span>
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-400">
                      Project: <span className="font-medium">{contribution.projectName}</span>
                    </p>
                    <div className="flex justify-between mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                      <span>Reward: {contribution.reward} points</span>
                      <span>{new Date(contribution.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Contributed */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="sei-gradient-text text-3xl font-bold mb-8" data-aos="fade-up">
            Projects Contributed To
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {profile.projectsContributed.map((project) => (
              <div
                key={project.id}
                className="bg-white dark:bg-white/10 rounded-xl p-6 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1" data-aos="fade-up"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <FolderGit2 className="h-5 w-5 text-gradient" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{project.name}</h3>
                    <p className="text-zinc-600 dark:text-zinc-400 mt-2">
                      {project.contributions} contributions • {project.rewards} points earned
                    </p>
                    <Link
                      href={`/projects/${project.id}`}
                      className="mt-4 inline-flex items-center text-gradient-to-r text-sm font-medium from-[#ff4d6d] via:#d946ef to:#7c3aed hover:underline"
                    >
                      View Project
                      <ArrowRight className="ml-2 h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 text-center">
        <div className="container mx-auto px-4">
          <h2 className="sei-gradient-text text-3xl font-bold mb-6" data-aos="fade-up">
            Ready to contribute more?
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-8 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="200">
            Explore open tasks across the Sei ecosystem and earn rewards for your skills.
          </p>
          <Link
            href="/projects"
            className="px-8 py-4 bg-gradient-to-r from-[#ff4d6d] via-[#d946ef] to:#7c3aed text-white font-medium rounded-lg hover:opacity-90 transition-all transform hover:-translate-y-1 inline-flex items-center" data-aos="fade-up" data-aos-delay="400"
          >
            <Users className="mr-3 h-4 w-4" />
            Browse Open Tasks
          </Link>
        </div>
      </section>
    </div>
  );
}