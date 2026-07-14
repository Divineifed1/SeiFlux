'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SubmissionStatus = 'pending' | 'approved' | 'rejected';

export interface SubmittedProject {
  id: string;
  name: string;
  slug: string;
  org: string;
  submittedBy: string;
  submittedAt: number;
  description: string;
  tags: string[];
  tech: string[];
  repoUrl?: string;
  status: SubmissionStatus;
}

interface ProjectSubmissionsState {
  submissions: SubmittedProject[];
  addSubmission: (data: Omit<SubmittedProject, 'id' | 'submittedAt' | 'status'>) => SubmittedProject;
  setStatus: (id: string, status: SubmissionStatus) => void;
}

export const useProjectSubmissions = create<ProjectSubmissionsState>()(
  persist(
    (set, get) => ({
      submissions: [],
      addSubmission: (data) => {
        const project: SubmittedProject = {
          ...data,
          id: `sub_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          submittedAt: Date.now(),
          status: 'pending',
        };
        set((s) => ({ submissions: [project, ...s.submissions] }));
        return project;
      },
      setStatus: (id, status) =>
        set((s) => ({
          submissions: s.submissions.map((p) => (p.id === id ? { ...p, status } : p)),
        })),
    }),
    { name: 'seiflux-project-submissions' }
  )
);

export function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
