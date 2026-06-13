"use client";

import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { ArrowRight, CircleCheck, GitBranch } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useAuth } from '../contexts/AuthContext';

export default function SubmitProjectPage() {
  const { isAuthenticated, login, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    description: '',
    githubUrl: '',
    techStack: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    AOS.init({
      once: true,
      duration: 800,
    });
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#050505]">
        <div className="h-12 w-12 border-2 border-gradient-to-r border-[from:#ff4d6d_via:#d946ef_to:#7c3aed] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#050505]">
        <div className="text-center space-y-8 max-w-md mx-auto px-4" data-aos="fade-up">
          <div className="h-16 w-16 mx-auto bg-gradient-to-r from-[#ff4d6d] via-[#d946ef] to-[#7c3aed] rounded-full flex items-center justify-center">
            <GitBranch className="h-8 w-8 text-white" />
          </div>
          <h1 className="sei-gradient-text text-3xl font-bold">
            Sign in to Submit a Project
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            You need to be signed in with GitHub to submit your project for review. Connect your account to get started.
          </p>
          <button
            onClick={login}
            className="flex items-center gap-3 mx-auto px-6 py-3 bg-gradient-to-r from-[#ff4d6d] via-[#d946ef] to-[#7c3aed] text-white font-medium rounded-lg hover:opacity-90 transition-all transform hover:-translate-y-1"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            Sign in with GitHub
          </button>
          <Link href="/" className="text-sm text-zinc-500 dark:text-zinc-400 hover:sei-gradient-text transition-all">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Project description is required';
    }
    if (!formData.githubUrl.trim()) {
      newErrors.githubUrl = 'GitHub repository URL is required';
    } else if (!formData.githubUrl.startsWith('https://github.com/')) {
      newErrors.githubUrl = 'GitHub URL must start with https://github.com/';
    }
    if (!formData.techStack.trim()) {
      newErrors.techStack = 'Tech stack is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setSubmitSuccess(true);
        setFormData({ name: '', email: '', description: '', githubUrl: '', techStack: '' });
      } catch (err) {
        console.error(err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#050505]">
        <div className="text-center space-y-8" data-aos="fade-up">
          <div className="h-12 w-12 mx-auto">
            <CircleCheck className="h-12 w-12 text-gradient" />
          </div>
          <h1 className="sei-gradient-text text-3xl font-bold">
            Your project has been submitted for review.
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 max-w-xl">
            Our team will review your submission and get back to you via email shortly.
            Please allow 1-2 business days for the review process.
          </p>
          <Link href="/" className="px-6 py-3 bg-gradient-to-r from-[#ff4d6d] via-[#d946ef] to-[#7c3aed] text-white font-medium rounded-lg hover:opacity-90 transition-all transform hover:-translate-y-1 inline-flex items-center">
            <ArrowRight className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] text-black dark:text-white transition-all">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="sei-gradient-text text-3xl font-bold mb-6" data-aos="fade-up">
            Submit Your Project
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mb-8" data-aos="fade-up" data-aos-delay="200">
            Help us grow the Sei ecosystem by submitting your project for review.
            Approved projects will be listed on SeiFlux and gain access to our contributor network.
          </p>
          <form onSubmit={handleSubmit} className="space-y-6" data-aos="fade-up" data-aos-delay="400">
            <div>
              <label className="block text-sm font-medium mb-2">
                Project Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter project name"
                className={`w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gradient-to-r focus:from-[#ff4d6d] focus:via-[#d946ef] focus:to-[#7c3aed] text-zinc-800 dark:text-zinc-200 ${
                  errors.name ? 'border-red-500' : ''
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.name}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter your email address"
                className={`w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7c3aed] text-zinc-800 dark:text-zinc-200 ${
                  errors.email ? 'border-red-500' : ''
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Project Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your project, its goals, and how it contributes to the Sei ecosystem"
                className={`w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7c3aed] text-zinc-800 dark:text-zinc-200 h-32 resize-none ${
                  errors.description ? 'border-red-500' : ''
                }`}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.description}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                GitHub Repository URL
              </label>
              <input
                type="text"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                placeholder="https://github.com/your-organization/your-project"
                className={`w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gradient-to-r focus:from-[#ff4d6d] focus:via:[#d946ef] focus:to:[#7c3aed] text-zinc-800 dark:text-zinc-200 ${
                  errors.githubUrl ? 'border-red-500' : ''
                }`}
              />
              {errors.githubUrl && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.githubUrl}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Tech Stack
              </label>
              <input
                type="text"
                value={formData.techStack}
                onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                placeholder="e.g., Next.js, TypeScript, NestJS, TypeORM"
                className={`w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gradient-to-r focus:from-[#ff4d6d] focus:via:[#d946ef] focus:to:[#7c3aed] text-zinc-800 dark:text-zinc-200 ${
                  errors.techStack ? 'border-red-500' : ''
                }`}
              />
              {errors.techStack && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.techStack}
                </p>
              )}
              <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                List the main technologies used in your project (comma separated)
              </p>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-8 py-3 ${
                  isSubmitting
                    ? 'bg-gradient-to-r from-[#ff4d6d40] via-[#d946ef40] to-[#7c3aed40] text-zinc-500'
                    : 'bg-gradient-to-r from-[#ff4d6d] via-[#d946ef] to:#7c3aed text-white font-medium'
                } rounded-lg hover:opacity-90 transition-all transform hover:-translate-y-1 disabled:cursor-not-allowed`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Project'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
