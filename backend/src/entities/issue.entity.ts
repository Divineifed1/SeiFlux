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

  @Column({ type: 'uuid' })
  projectId: string;

  @Column({ type: 'enum', enum: ['good-first-issue', 'bounty', 'documentation', 'bug-fix', 'feature'] })
  type: IssueType;

  @Column({ type: 'enum', enum: ['open', 'closed', 'in-progress'], default: 'open' })
  status: IssueStatus;

  @Column({ type: 'enum', enum: ['beginner', 'intermediate', 'advanced'] })
  difficulty: DifficultyLevel;

  @Column({ type: 'simple-array', nullable: true })
  skills: string;

  @Column({ nullable: true })
  bountyAmount?: number;

  @Column({ nullable: true })
  bountyToken?: string;

  @Column({ type: 'simple-array', nullable: true })
  requirements: string;

  @Column({ default: 0 })
  applicantCount: number;

  @Column({ default: 0 })
  viewCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
