export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'maintainer' | 'contributor';
  githubUsername?: string;
  createdAt: Date;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  githubOrg?: string;
  website?: string;
  maintainerId: string;
  projectCount: number;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: Date;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDescription?: string;
  organizationId: string;
  organization?: Organization;
  repoUrl?: string;
  websiteUrl?: string;
  logo?: string;
  tags: string[];
  techStack: string[];
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'suspended';
  starCount: number;
  forkCount: number;
  contributorCount: number;
  openOpportunities: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Opportunity {
  id: string;
  projectId: string;
  project?: Project;
  title: string;
  description: string;
  type: 'bug' | 'feature' | 'documentation' | 'design' | 'other';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  skills: string[];
  isOpen: boolean;
  applicationCount: number;
  createdAt: Date;
}

export interface Application {
  id: string;
  opportunityId: string;
  opportunity?: Opportunity;
  contributorId: string;
  contributor?: User;
  coverLetter?: string;
  githubProfile?: string;
  status: 'pending' | 'review' | 'approved' | 'rejected';
  appliedAt: Date;
  updatedAt: Date;
}

export interface Contributor {
  id: string;
  userId: string;
  user?: User;
  bio?: string;
  skills: string[];
  githubProfile?: string;
  activeProjects: number;
  completedContributions: number;
  joinedAt: Date;
}

export interface PlatformStats {
  totalProjects: number;
  totalOrganizations: number;
  totalContributors: number;
  totalApplications: number;
  activeProjects: number;
  pendingReviews: number;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  href?: string;
  createdAt: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
