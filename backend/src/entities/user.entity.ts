import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Project } from './project.entity';

export type UserRole = 'admin' | 'maintainer' | 'contributor';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ nullable: true, name: 'github_id' })
  githubId?: string;

  @Column({ nullable: true, name: 'github_username' })
  githubUsername?: string;

  @Column({ type: 'enum', enum: ['admin', 'maintainer', 'contributor'], default: 'contributor' })
  role: UserRole;

  @Column({ nullable: true, name: 'organization_id' })
  organizationId?: string;

  @Column({ nullable: true, name: 'wallet_address' })
  walletAddress?: string;

  @ManyToOne(() => Project, (project) => project.maintainers, { nullable: true })
  maintainedProject?: Project;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}