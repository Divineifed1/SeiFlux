import { useQuery } from '@tanstack/react-query';

export type ActivityEventType =
  | 'project_created'
  | 'contributor_joined'
  | 'pr_opened'
  | 'pr_merged'
  | 'issue_posted'
  | 'application_submitted'
  | 'org_created';

export interface ActivityEvent {
  id: string;
  type: ActivityEventType;
  actor: { name: string; handle: string; initials: string };
  target: string;
  targetHref?: string;
  description: string;
  createdAt: string;
  meta?: Record<string, string | number>;
}

export function useActivityFeed(limit = 20) {
  return useQuery({
    queryKey: ['activity', limit],
    queryFn: async (): Promise<ActivityEvent[]> => {
      const response = await fetch(`/api/activity?limit=${limit}`);
      if (!response.ok) {
        throw new Error('Failed to fetch activity');
      }
      return response.json();
    },
    staleTime: 30_000,
  });
}
