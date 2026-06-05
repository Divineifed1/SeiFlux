"use client";

import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { ArrowRight, CircleCheck } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function SubmitProjectPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    description: '',
    githubUrl: '',
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
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      // Simulate API call
      try {
        // In a real app, we would call the backend API here
        // For now, we'll just simulate a delay
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setSubmitSuccess(true);
        // Reset form
        setFormData({ name: '', email: '', description: '', githubUrl: '' });
      } catch (err) {
        // Handle error
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
                className={`w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gradient-to-r focus:from-[#ff4d6d] focus:via-[#d946ef] focus:to:#7c3aed] text-zinc-800 dark:text-zinc-200 ${
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
                className={`w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gradient-to-r focus:from-[#ff4d6d] focus:via:#d946ef focus:to:#7c3aed] text-zinc-800 dark:text-zinc-200 h-32 resize-none ${
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
                className={`w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gradient-to-r focus:from-[#ff4d6d] focus:via:#d946ef focus:to:#7c3aed] text-zinc-800 dark:text-zinc-200 ${
                  errors.githubUrl ? 'border-red-500' : ''
                }`}
              />
              {errors.githubUrl && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.githubUrl}
                </p>
              )}
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