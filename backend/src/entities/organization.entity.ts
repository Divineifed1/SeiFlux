import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('organizations')
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true, name: 'github_org' })
  githubOrg?: string;

  @Column({ nullable: true })
  website?: string;

  @Column({ default: 'active' })
  status: 'active' | 'pending' | 'suspended';

  @Column({ nullable: true, name: 'owner_id' })
  ownerId?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}