import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export type WaveStatus = 'upcoming' | 'active' | 'completed';

@Entity('waves')
export class Wave {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'timestamptz', name: 'startsat' })
  startsAt: Date;

  @Column({ type: 'timestamptz', name: 'endsat' })
  endsAt: Date;

  @Column({ type: 'enum', enum: ['upcoming', 'active', 'completed'], default: 'upcoming' })
  status: WaveStatus;

  @Column({ type: 'timestamptz', name: 'createdat', nullable: true })
  createdAt: Date;

  @Column({ type: 'timestamptz', name: 'updatedat', nullable: true })
  updatedAt: Date;

  @Column({ name: 'totalpoints', default: 0 })
  totalPoints: number;

  @Column({ name: 'participantcount', default: 0 })
  participantCount: number;
}
