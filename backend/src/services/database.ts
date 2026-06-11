import { getSupabase } from '../lib/supabase.js';
import { User, Project, Wave, Contributor, Task, ProjectWave, ProjectContributor } from '../types/index.js';

export class DatabaseService {
  // Users
  static async findOrCreateUser(userData: { login: string; avatar_url: string; name?: string }): Promise<User | null> {
    const supabase = getSupabase();
    const { data: existing } = await supabase
      .from('Users')
      .select('*')
      .eq('Login', userData.login)
      .single();

    if (existing) return existing as User;

    const { data: newUser } = await supabase
      .from('Users')
      .insert({
        Login: userData.login,
        AvatarUrl: userData.avatar_url,
        Name: userData.name || userData.login,
      })
      .select()
      .single();

    return newUser as User | null;
  }

  static async getUserByLogin(login: string): Promise<User | null> {
    const supabase = getSupabase();
    const { data } = await supabase
      .from('Users')
      .select('*')
      .eq('Login', login)
      .single();

    return data as User | null;
  }

  // Projects
  static async createProject(projectData: {
    name: string;
    description: string;
    githubUrl: string;
    techStack: string;
    submitterId: number;
  }): Promise<Project | null> {
    const supabase = getSupabase();
    const { data } = await supabase
      .from('Projects')
      .insert(projectData)
      .select()
      .single();

    return data as Project | null;
  }

  static async getAllProjects(): Promise<Project[]> {
    const supabase = getSupabase();
    const { data } = await supabase
      .from('Projects')
      .select('*')
      .order('CreatedAt', { ascending: false });

    return (data || []) as Project[];
  }

  static async getProjectById(id: number): Promise<Project | null> {
    const supabase = getSupabase();
    const { data } = await supabase
      .from('Projects')
      .select('*')
      .eq('Id', id)
      .single();

    return data as Project | null;
  }

  static async updateProjectStatus(id: number, status: string): Promise<Project | null> {
    const supabase = getSupabase();
    const { data } = await supabase
      .from('Projects')
      .update({ Status: status, UpdatedAt: new Date().toISOString() })
      .eq('Id', id)
      .select()
      .single();

    return data as Project | null;
  }

  static async deleteProject(id: number): Promise<boolean> {
    const supabase = getSupabase();
    const { error } = await supabase
      .from('Projects')
      .delete()
      .eq('Id', id);

    return !error;
  }

  // Waves
  static async getActiveWave(): Promise<Wave | null> {
    const supabase = getSupabase();
    const { data } = await supabase
      .from('Waves')
      .select('*')
      .eq('Status', 'active')
      .order('CreatedAt', { ascending: false })
      .limit(1)
      .maybeSingle();

    return data as Wave | null;
  }

  static async getAllWaves(): Promise<Wave[]> {
    const supabase = getSupabase();
    const { data } = await supabase
      .from('Waves')
      .select('*')
      .order('CreatedAt', { ascending: false });

    return (data || []) as Wave[];
  }

  // Contributors
  static async findOrCreateContributor(contributorData: {
    login: string;
    avatar_url: string;
    name?: string;
  }): Promise<Contributor | null> {
    const supabase = getSupabase();
    const { data: existing } = await supabase
      .from('Contributors')
      .select('*')
      .eq('GitHubLogin', contributorData.login)
      .single();

    if (existing) return existing as Contributor;

    const { data: newContributor } = await supabase
      .from('Contributors')
      .insert({
        GitHubLogin: contributorData.login,
        AvatarUrl: contributorData.avatar_url,
        Name: contributorData.name || contributorData.login,
      })
      .select()
      .single();

    return newContributor as Contributor | null;
  }

  // Tasks
  static async getTasksByProject(projectId: number): Promise<Task[]> {
    const supabase = getSupabase();
    const { data } = await supabase
      .from('Tasks')
      .select('*')
      .eq('ProjectId', projectId)
      .order('CreatedAt', { ascending: false });

    return (data || []) as Task[];
  }

  // Stats
  static async getAdminStats() {
    const supabase = getSupabase();
    const [projectsCount, contributorsCount, rewardsResult] = await Promise.all([
      supabase.from('Projects').select('*', { count: 'exact', head: true }),
      supabase.from('Contributors').select('*', { count: 'exact', head: true }),
      supabase.from('Tasks').select('RewardPoints'),
    ]);

    const totalRewards = rewardsResult.data?.reduce((sum, t) => sum + (t.RewardPoints || 0), 0) || 0;

    return {
      totalProjects: projectsCount.count || 0,
      totalContributors: contributorsCount.count || 0,
      totalRewards,
    };
  }
}
