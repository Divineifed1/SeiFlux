import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export type RewardStatus = 'pending' | 'processing' | 'paid';

@Entity('rewards')
export class Reward {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @Column({ type: 'uuid', name: 'wave_id', nullable: true })
  waveId?: string;

  @Column({ type: 'text', nullable: true, name: 'issue_title' })
  issueTitle?: string;

  @Column({ type: 'numeric', default: 0 })
  amount: number;

  @Column({
    type: 'enum',
    enum: ['pending', 'processing', 'paid'],
    default: 'pending',
  })
  status: RewardStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
