import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Project } from './project.entity';

export type IssueType = 'good-first-issue' | 'bounty' | 'documentation' | 'bug-fix' | 'feature';
export type IssueStatus = 'open' | 'closed' | 'in-progress';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

@Entity('issues')
export class Issue {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'uuid', name: 'project_id' })
  projectId: string;

  @Column({ type: 'enum', enum: ['good-first-issue', 'bounty', 'documentation', 'bug-fix', 'feature'] })
  type: IssueType;

  @Column({ type: 'enum', enum: ['open', 'closed', 'in-progress'], default: 'open' })
  status: IssueStatus;

  @Column({ type: 'enum', enum: ['beginner', 'intermediate', 'advanced'] })
  difficulty: DifficultyLevel;

  @Column({ default: 0, name: 'points' })
  points: number;

  @Column({ type: 'uuid', name: 'assignee_id', nullable: true })
  assigneeId?: string;

  @Column({ type: 'simple-array', nullable: true })
  skills: string;

  @Column({ nullable: true, name: 'bounty_amount' })
  bountyAmount?: number;

  @Column({ nullable: true, name: 'bounty_token' })
  bountyToken?: string;

  @Column({ type: 'simple-array', nullable: true })
  requirements: string;

  @Column({ default: 0, name: 'applicant_count' })
  applicantCount: number;

  @Column({ default: 0, name: 'view_count' })
  viewCount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
