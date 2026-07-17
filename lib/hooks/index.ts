/**
 * React Query hooks for the SeiFlux API.
 *
 * Query key conventions:
 *   ['organizations']            — list
 *   ['organizations', id]        — single item
 *   ['projects']                 — list (all)
 *   ['projects', orgId]          — list scoped to org
 *   ['projects', _, slug]        — single item by slug
 *   ['contributors']             — list
 *   ['contributors', id]         — single item
 *   ['applications']             — list (all)
 *   ['applications', projectId]  — list scoped to project
 *   ['github', 'repos']          — all connected repos
 *   ['github', 'repos', name]    — single repo detail
 *   ['github', 'orgs']           — connected GitHub orgs
 *   ['issues']                   — list (all)
 *   ['issues', type]             — list filtered by type
 *   ['issues', id]               — single issue
 *   ['analytics', period]        — aggregated analytics for period
 *   ['notifications']            — list
 *   ['notifications', 'unread-count'] — unread badge count
 *   ['activity', limit]          — global activity feed
 *   ['users']                    — list all users
 */

export { useOrganizations, useOrganization } from './use-organizations';
export { useProjects, useProject } from './use-projects';
export { useContributors } from './use-contributors';
export { useApplications } from './use-applications';
export { useUsers } from './use-users';
export { useGithubRepos, useGithubRepo, useGithubOrgs } from './use-github';
export { useIssues, useIssue } from './use-issues';
export { useWaves, useCurrentWave } from './use-waves';
export { useAnalytics } from './use-analytics';
export { useNotifications, useUnreadCount, useMarkNotificationRead, useMarkAllRead } from './use-notifications';
export { useActivityFeed } from './use-activity';