export type User = {
  Id: number;
  GitHubId: string;
  Login: string;
  AvatarUrl: string;
  Name: string;
  Email?: string;
  IsAdmin: boolean;
  CreatedAt: string;
};

export type Project = {
  Id: number;
  Name: string;
  Description: string;
  GitHubUrl: string;
  TechStack: string;
  SubmitterId: number;
  Status: string;
  CreatedAt: string;
  UpdatedAt: string;
};

export type Wave = {
  Id: number;
  Name: string;
  StartsAt: string;
  EndsAt: string;
  Status: string;
  TotalPoints: number;
  ParticipantCount: number;
  CreatedAt: string;
};

export type Contributor = {
  Id: number;
  GitHubLogin: string;
  AvatarUrl: string;
  Name: string;
  Email?: string;
  Reputation: number;
  CreatedAt: string;
};

export type Task = {
  Id: number;
  ProjectId: number;
  Title: string;
  Description?: string;
  RewardPoints: number;
  Status: string;
  AssigneeId?: number;
  CreatedAt: string;
};

export type ProjectWave = {
  Id: number;
  ProjectId: number;
  WaveId: number;
  WaveStatus: string;
  WavePoints: number;
  JoinedAt?: string;
};

export type ProjectContributor = {
  Id: number;
  ProjectId: number;
  ContributorId: number;
  JoinedAt: string;
};
