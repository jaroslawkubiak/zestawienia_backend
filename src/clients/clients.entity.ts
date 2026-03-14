import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Avatar } from '../avatar/avatar.entity';
import { ClientLogs } from '../client-logs/client-logs.entity';
import { Email } from '../email/email.entity';
import { Set } from '../sets/sets.entity';

@Entity('client')
export class Client {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'text', nullable: true })
  company: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  firstName: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  lastName: string;

  @Column({ type: 'varchar', length: 150, nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 150, nullable: false })
  secondEmail: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  telephone: string;

  @OneToMany(() => Set, (set) => set.clientId)
  set: Set[];

  @OneToMany(() => Email, (email) => email.clientId)
  logEmail: Email[];

  @Column({ type: 'varchar', length: 30, nullable: false })
  hash: string;

  @OneToMany(() => ClientLogs, (log) => log.client)
  clientLogs: ClientLogs[];

  @ManyToOne(() => Avatar, { nullable: true })
  @JoinColumn({ name: 'avatarId' })
  avatar: Avatar;

  @OneToMany(() => Avatar, (avatar) => avatar.client)
avatars: Avatar[];
}
