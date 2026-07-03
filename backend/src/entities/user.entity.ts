import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

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

  @Column({ nullable: true })
  githubId?: string;

  @Column({ nullable: true })
  githubUsername?: string;

  @Column({ type: 'enum', enum: ['admin', 'maintainer', 'contributor'], default: 'contributor' })
  role: UserRole;

  @Column({ nullable: true })
  organizationId?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}