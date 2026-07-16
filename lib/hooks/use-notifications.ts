import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export type NotificationType =
  | 'application_accepted'
  | 'application_rejected'
  | 'new_issue'
  | 'issue_application'
  | 'maintainer_message'
  | 'project_update'
  | 'pr_merged'
  | 'new_contributor'
  | 'reward_received';

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

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001/api';

async function fetchNotifications(): Promise<Notification[]> {
  const res = await fetch(`${API_BASE}/notifications`);
  if (!res.ok) {
    throw new Error('Failed to fetch notifications');
  }
  return res.json();
}

async function fetchUnreadCount(): Promise<number> {
  const res = await fetch(`${API_BASE}/notifications/unread-count`);
  if (!res.ok) {
    throw new Error('Failed to fetch unread notification count');
  }
  const data = await res.json();
  return data.count;
}

async function markNotificationRead(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/notifications/${id}/read`, { method: 'POST' });
  if (!res.ok) {
    throw new Error('Failed to mark notification as read');
  }
}

async function markAllRead(): Promise<void> {
  const res = await fetch(`${API_BASE}/notifications/read-all`, { method: 'POST' });
  if (!res.ok) {
    throw new Error('Failed to mark all notifications as read');
  }
}

export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
    staleTime: 30_000,
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: fetchUnreadCount,
    staleTime: 15_000,
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useMarkAllRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: markAllRead,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}