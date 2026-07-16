import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Issue } from './issue.entity';
import { Wave } from './wave.entity';
import { User } from './user.entity';

export type ApplicationStatus = 'pending' | 'review' | 'approved' | 'rejected' | 'merged' | 'closed';

@Entity('applications')
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'opportunity_id' })
  opportunityId: string;

  @Column({ type: 'uuid', name: 'applicant_id', nullable: true })
  applicantId?: string;

  @Column({ type: 'uuid', name: 'wave_id', nullable: true })
  waveId?: string;

  @Column({ name: 'applicant_name' })
  applicantName: string;

  @Column({ name: 'applicant_handle' })
  applicantHandle: string;

  @Column({ type: 'text', nullable: true, name: 'message' })
  message?: string;

  @Column({ type: 'enum', enum: ['pending', 'review', 'approved', 'rejected', 'merged', 'closed'], default: 'pending' })
  status: ApplicationStatus;

  @Column({ type: 'timestamptz', nullable: true, name: 'applied_at' })
  appliedAt?: Date;

  @ManyToOne(() => Issue, { nullable: true })
  @JoinColumn({ name: 'opportunity_id', referencedColumnName: 'id' })
  issue?: Issue;

  @ManyToOne(() => Wave, { nullable: true })
  @JoinColumn({ name: 'wave_id' })
  wave?: Wave;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'applicant_id' })
  applicant?: User;
}
