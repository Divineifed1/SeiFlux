"use client";

import Link from 'next/link';
import { Rocket, Trophy, User, Users, FolderGit2 } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    AOS.init({
      once: true,
      duration: 800,
    });
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] text-black dark:text-white transition-all">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-white to-slate-50 dark:from-[#09090b] dark:to-[#050505] overflow-hidden">
        <div className="absolute inset-0 -z-10">
          {/* Animated gradients and floating particles would go here */}
          <div className="h-full w-full bg-gradient-to-tr from-[#ff4d6d20] via-[#d946ef10] to-[#7c3aed20] animate-[gradient-shift_15s_ease_infinite]"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl text-center">
            <h1 className="sei-gradient-text text-5xl md:text-6xl font-bold mb-6" data-aos="fade-up">
              Powering Open-Source Collaboration on Sei
            </h1>
            <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 mb-8 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="200">
              Connect projects, contributors, and rewards in one seamless ecosystem.
            </p>
            <div className="flex flex-wrap justify-center gap-4" data-aos="fade-up" data-aos-delay="400">
              <Link href="/submit-project" className="flex items-center px-8 py-4 bg-gradient-to-r from-[#ff4d6d] via-[#d946ef] to-[#7c3aed] text-white font-medium rounded-lg hover:opacity-90 transition-all transform hover:-translate-y-1">
                <Rocket className="mr-3 h-4 w-4" />
                Submit Project
              </Link>
              <Link href="/projects" className="flex items-center px-8 py-4 border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-all transform hover:-translate-y-1">
                <Users className="mr-3 h-4 w-4" />
                Explore Projects
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-[#0f172a]">
        <div className="container mx-auto px-4">
          <h2 className="sei-gradient-text text-4xl font-bold text-center mb-16" data-aos="fade-up">
            Features
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-white/10 rounded-xl p-8 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-2" data-aos="fade-up" data-aos-delay="200">
              <div className="flex items-center mb-4">
                <Rocket className="h-8 w-8 text-gradient mr-4" />
                <h3 className="text-xl font-semibold">Discover Projects</h3>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400">
                Browse innovative Sei ecosystem projects looking for contributors.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="bg-white dark:bg-white/10 rounded-xl p-8 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-2" data-aos="fade-up" data-aos-delay="400">
              <div className="flex items-center mb-4">
                <Trophy className="h-8 w-8 text-gradient mr-4" />
                <h3 className="text-xl font-semibold">Contribute and Earn Rewards</h3>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400">
                Complete tasks, build your reputation, and earn rewards for your contributions.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="bg-white dark:bg-white/10 rounded-xl p-8 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-2" data-aos="fade-up" data-aos-delay="600">
              <div className="flex items-center mb-4">
                <User className="h-8 w-8 text-gradient mr-4" />
                <h3 className="text-xl font-semibold">Build Reputation</h3>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400">
                Establish yourself as a trusted contributor in the Sei ecosystem.
              </p>
            </div>
            {/* Feature 4 */}
            <div className="bg-white dark:bg-white/10 rounded-xl p-8 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-2" data-aos="fade-up" data-aos-delay="800">
              <div className="flex items-center mb-4">
                <FolderGit2 className="h-8 w-8 text-gradient mr-4" />
                <h3 className="text-xl font-semibold">Seamless GitHub Integration</h3>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400">
                Connect your GitHub to streamline contributions and track your impact.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50 dark:from-[#09090b] dark:to-[#050505]">
        <div className="container mx-auto px-4">
          <h2 className="sei-gradient-text text-4xl font-bold text-center mb-16" data-aos="fade-up">
            How It Works
          </h2>
          <div className="max-w-5xl mx-auto">
            <div className="space-y-12">
              {/* Step 1 */}
              <div className="flex flex-col md:flex-row items-center gap-8 p-8 bg-white dark:bg-white/10 rounded-xl shadow-md" data-aos="fade-right" data-aos-delay="200">
                <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-r from-[#ff4d6d] via-[#d946ef] to-[#7c3aed] rounded-full flex items-center justify-center text-white">
                  <span className="text-xl">1</span>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-2">Submit a Project</h3>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    Project owners submit their Sei ecosystem projects for review.
                  </p>
                </div>
              </div>
              {/* Step 2 */}
              <div className="flex flex-col md:flex-row md:flex-row-reverse items-center gap-8 p-8 bg-white dark:bg-white/10 rounded-xl shadow-md" data-aos="fade-left" data-aos-delay="400">
                <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-r from-[#ff4d6d] via-[#d946ef] to-[#7c3aed] rounded-full flex items-center justify-center text-white">
                  <span className="text-xl">2</span>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-2">Admin Reviews Project</h3>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    Admins review submissions to ensure quality and alignment with Sei values.
                  </p>
                </div>
              </div>
              {/* Step 3 */}
              <div className="flex flex-col md:flex-row items-center gap-8 p-8 bg-white dark:bg-white/10 rounded-xl shadow-md" data-aos="fade-right" data-aos-delay="600">
                <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-r from-[#ff4d6d] via-[#d946ef] to-[#7c3aed] rounded-full flex items-center justify-center text-white">
                  <span className="text-xl">3</span>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-2">Project Gets Approved</h3>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    Approved projects are listed on the platform for contributors to discover.
                  </p>
                </div>
              </div>
              {/* Step 4 */}
              <div className="flex flex-col md:flex-row md:flex-row-reverse items-center gap-8 p-8 bg-white dark:bg-white/10 rounded-xl shadow-md" data-aos="fade-left" data-aos-delay="800">
                <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-r from-[#ff4d6d] via-[#d946ef] to-[#7c3aed] rounded-full flex items-center justify-center text-white">
                  <span className="text-xl">4</span>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-2">Contributors Join</h3>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    Contributors browse projects and contribute to tasks that match their skills.
                  </p>
                </div>
              </div>
              {/* Step 5 */}
              <div className="flex flex-col md:flex-row items-center gap-8 p-8 bg-white dark:bg-white/10 rounded-xl shadow-md" data-aos="fade-right" data-aos-delay="1000">
                <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-r from-[#ff4d6d] via-[#d946ef] to-[#7c3aed] rounded-full flex items-center justify-center text-white">
                  <span className="text-xl">5</span>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-2">Rewards Are Distributed</h3>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    Contributors earn rewards based on their contributions and reputation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-[#ff4d6d] via-[#d946ef] to-[#7c3aed]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-white text-3xl font-bold mb-6" data-aos="fade-up">
            Ready to start collaborating on Sei?
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="200">
            Join the SeiFlux ecosystem and help power the next generation of open-source projects.
          </p>
          <div className="flex flex-wrap justify-center gap-4" data-aos="fade-up" data-aos-delay="400">
            <Link href="/submit-project" className="flex items-center px-8 py-4 bg-white text-gradient-to-r from-[#ff4d6d] via-[#d946ef] to-[#7c3aed] font-medium rounded-lg hover:opacity-90 transition-all transform hover:-translate-y-1">
              <Rocket className="mr-3 h-4 w-4" />
              Submit Your Project
            </Link>
            <Link href="/projects" className="flex items-center px-8 py-4 bg-white/20 text-white border border-white/20 rounded-lg hover:bg-white/30 transition-all transform hover:-translate-y-1">
              <Users className="mr-3 h-4 w-4" />
              Explore Projects
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}