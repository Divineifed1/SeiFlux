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
 */

export { useOrganizations, useOrganization } from './use-organizations';
export { useProjects, useProject } from './use-projects';
export { useContributors, useContributor } from './use-contributors';
export { useApplications } from './use-applications';
