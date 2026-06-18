/**
 * React Query hooks for the SEI Builders Hub API.
 *
 * All hooks use mock data today. When a real API is available, replace
 * the `queryFn` implementations — the calling components need no changes.
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
 *   ['opportunities']            — list (all)
 *   ['opportunities', type]      — list filtered by type
 *   ['opportunities', id]        — single opportunity
 *   ['analytics', period]        — aggregated analytics for period
 *   ['notifications']            — list
 *   ['notifications', 'unread-count'] — unread badge count
 *   ['activity', limit]          — global activity feed
 */

export { useOrganizations, useOrganization } from './use-organizations';
export { useProjects, useProject } from './use-projects';
export { useContributors, useContributor } from './use-contributors';
export { useApplications } from './use-applications';
export { useGithubRepos, useGithubRepo, useGithubOrgs } from './use-github';
export { useOpportunities, useOpportunity } from './use-opportunities';
export { useAnalytics } from './use-analytics';
export { useNotifications, useUnreadCount, useMarkNotificationRead, useMarkAllRead } from './use-notifications';
export { useActivityFeed } from './use-activity';
