import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export type NotificationType =
  | 'application_accepted'
  | 'application_rejected'
  | 'new_issue'
  | 'maintainer_message'
  | 'project_update'
  | 'pr_merged'
  | 'new_contributor';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  href?: string;
  avatarInitials?: string;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    type: 'application_accepted',
    title: 'Application Accepted',
    message: 'Your application to contribute to SeiSwap DEX has been accepted.',
    read: false,
    createdAt: '2m ago',
    href: '/dashboard/applications',
    avatarInitials: 'AB',
  },
  {
    id: 'n2',
    type: 'new_issue',
    title: 'New Issue',
    message: 'SeiNFT Marketplace posted a new bounty: Build NFT metadata indexer.',
    read: false,
    createdAt: '18m ago',
    href: '/dashboard/issues',
    avatarInitials: 'SN',
  },
  {
    id: 'n3',
    type: 'pr_merged',
    title: 'PR Merged',
    message: 'Your pull request #42 "Fix liquidity pool calculation" was merged.',
    read: false,
    createdAt: '1h ago',
    href: '/dashboard/github',
    avatarInitials: 'GH',
  },
  {
    id: 'n4',
    type: 'maintainer_message',
    title: 'Message from Maintainer',
    message: 'Alex Builder commented on your application: "Great portfolio! Can you share more about your DeFi experience?"',
    read: false,
    createdAt: '3h ago',
    href: '/dashboard/applications',
    avatarInitials: 'AB',
  },
  {
    id: 'n5',
    type: 'application_rejected',
    title: 'Application Update',
    message: 'Your application for the SeiOracle documentation task was not selected this time.',
    read: true,
    createdAt: '1d ago',
    href: '/dashboard/applications',
    avatarInitials: 'SO',
  },
  {
    id: 'n6',
    type: 'project_update',
    title: 'Project Update',
    message: 'SeiSwap Labs updated their contribution guidelines. Review the changes before submitting.',
    read: true,
    createdAt: '2d ago',
    href: '/dashboard/projects',
    avatarInitials: 'SL',
  },
  {
    id: 'n7',
    type: 'new_issue',
    title: 'New Issue Match',
    message: 'Based on your skills in Rust and TypeScript, you may be interested in: "Build staking rewards contract".',
    read: true,
    createdAt: '3d ago',
    href: '/dashboard/issues',
    avatarInitials: 'SF',
  },
  {
    id: 'n8',
    type: 'new_contributor',
    title: 'New Contributor Joined',
    message: 'sarah_builds joined your organization SeiSwap Labs.',
    read: true,
    createdAt: '5d ago',
    href: '/dashboard/organizations',
    avatarInitials: 'SB',
  },
];

let _notifications = [...MOCK_NOTIFICATIONS];

export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async (): Promise<Notification[]> => {
      await new Promise((r) => setTimeout(r, 300));
      return _notifications;
    },
    staleTime: 30_000,
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: async (): Promise<number> => {
      await new Promise((r) => setTimeout(r, 200));
      return _notifications.filter((n) => !n.read).length;
    },
    staleTime: 15_000,
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await new Promise((r) => setTimeout(r, 100));
      _notifications = _notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useMarkAllRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await new Promise((r) => setTimeout(r, 200));
      _notifications = _notifications.map((n) => ({ ...n, read: true }));
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}
