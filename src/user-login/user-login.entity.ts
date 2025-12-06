import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity('user_logins')
export class UserLogin {
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
  reason: string | null;

  @Column({ type: 'text', nullable: true })
  token: string | null;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ip_address: string | null;

  @Column({ type: 'text', nullable: true })
  user_agent: string | null;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  login_at: Date;

  @Column({ type: 'datetime', nullable: true })
  logout_at: Date | null;
}
