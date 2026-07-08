import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Issue } from './issue.entity';
import { Wave } from './wave.entity';

export type ApplicationStatus = 'pending' | 'review' | 'approved' | 'rejected' | 'merged' | 'closed';

@Entity('applications')
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  issueId: string;

  @ManyToOne(() => Issue)
  @JoinColumn({ name: 'issueId' })
  issue?: Issue;

  @Column({ type: 'uuid', nullable: true })
  contributorId: string;

  @Column({ type: 'uuid', nullable: true })
  waveId?: string;

  @ManyToOne(() => Wave)
  @JoinColumn({ name: 'waveId' })
  wave?: Wave;

  @Column({ type: 'text', nullable: true })
  coverLetter?: string;

  @Column({ type: 'text', nullable: true })
  githubProfile?: string;

  @Column({ type: 'enum', enum: ['pending', 'review', 'approved', 'rejected', 'merged', 'closed'], default: 'pending' })
  status: ApplicationStatus;

  @Column({ type: 'timestamptz', nullable: true })
  appliedAt?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  updatedAt?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  closedAt?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  rolledOverAt?: Date;
}
