import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { WaveStatus } from './wave-status.enum';
import { Project } from '../projects/project.entity';

@Entity()
export class Wave {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column({
    type: 'simple-array',
    nullable: true,
  })
  tags: string[];

  @Column({ type: 'datetime' })
  startsAt: Date;

  @Column({ type: 'datetime' })
  endsAt: Date;

  @Column({
    type: 'enum',
    enum: WaveStatus,
    default: WaveStatus.UPCOMING,
  })
  status: WaveStatus;

  @Column({ type: 'int', default: 0 })
  totalPoints: number;

  @Column({ type: 'int', default: 0 })
  participantCount: number;

  @ManyToMany(() => Project, {
    cascade: true,
  })
  @JoinTable({
    name: 'wave_projects',
    joinColumn: { name: 'wave_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'project_id', referencedColumnName: 'id' },
  })
  projects: Project[];

  @CreateDateColumn()
  createdAt: Date;
}
