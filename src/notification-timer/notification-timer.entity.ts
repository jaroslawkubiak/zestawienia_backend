import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Set } from '../sets/sets.entity';
import { ENotificationDirection } from './types/notification-direction.enum';
import { TTimerStatus } from './types/TimerStatus.type';


@Entity('notification-timer')
export class NotificationTimer {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @ManyToOne(() => Set, (set) => set.notificationTimers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'setId', referencedColumnName: 'id' })
  setId: Set;

  @Column({
    type: 'enum',
    enum: ENotificationDirection,
    enumName: 'notification_direction_enum',
    nullable: false,
  })
  notificationDirection: ENotificationDirection;

  @Column({
    type: 'enum',
    enum: ['active', 'fired', 'cancelled'],
    default: 'active',
  })
  status: TTimerStatus;

  @Column({ type: 'int', unsigned: true })
  delayMs: number;

  @Column({ type: 'datetime', nullable: false })
  startedAt: Date;

  @Column({ type: 'datetime', nullable: false })
  fireAt: Date;

  @Column({ type: 'datetime', nullable: true })
  firedAt: Date | null;

  @Column({ type: 'datetime', nullable: true })
  cancelledAt: Date | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
