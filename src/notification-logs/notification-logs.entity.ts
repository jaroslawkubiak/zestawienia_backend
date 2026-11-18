import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ENotificationSeverity } from './types/notification-severity.enum';
import { User } from '../user/user.entity';

@Entity('notification-logs')
export class NotificationLogs {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({
    type: 'enum',
    enum: ENotificationSeverity,
    enumName: 'notification_direction_enum',
    nullable: false,
  })
  severity: ENotificationSeverity;

  @Column({ type: 'text', nullable: false })
  message: string;

  @Column({ type: 'json', nullable: true })
  details: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'int', nullable: false })
  life: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  createdAt: string;

  @Column({ type: 'bigint', nullable: false })
  createdAtTimestamp: number;
}
