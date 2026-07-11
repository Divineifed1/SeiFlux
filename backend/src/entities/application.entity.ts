import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Issue } from './issue.entity';
import { Wave } from './wave.entity';

export type ApplicationStatus = 'pending' | 'review' | 'approved' | 'rejected' | 'merged' | 'closed';

@Entity('applications')
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'opportunity_id' })
  opportunityId: string;

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
}
