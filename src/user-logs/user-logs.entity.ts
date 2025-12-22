import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity('user-logs')
export class UserLogs {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @ManyToOne(() => User, (user) => user.logins, { nullable: true })
  @Index()
  user: User | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  login: string | null;

  @Column({ type: 'tinyint', width: 1 })
  success: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  reject_reason: string | null;

  @Column({ type: 'text', nullable: true })
  token: string | null;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ip_address: string | null;

  @Column({ type: 'text', nullable: true })
  user_agent: string | null;

  @Column({ type: 'varchar', length: 50, nullable: false })
  login_at: Date;

  @Column({ type: 'bigint', nullable: false })
  login_at_timestamp: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  logout_at: string | null;

  @Column({ type: 'bigint', nullable: true })
  logout_at_timestamp: number | null;
}
