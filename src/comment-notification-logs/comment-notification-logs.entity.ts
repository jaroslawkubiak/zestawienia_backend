import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Client } from '../clients/clients.entity';
import { ENotificationDirection } from '../notification-timer/types/notification-direction.enum';
import { Set } from '../sets/sets.entity';

@Entity('comment-notification-logs')
export class CommentNotificationLogs {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 150, nullable: false })
  to: string;

  @Column({
    type: 'enum',
    enum: ENotificationDirection,
    enumName: 'notification_direction_enum',
    nullable: false,
  })
  notificationDirection: ENotificationDirection;

  @Column({ type: 'text', nullable: false })
  content: string;

  @Column({ type: 'int', nullable: false })
  unreadComments: number;

  @Column({ type: 'int', nullable: false })
  needsAttentionComments: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  sendAt: string;

  @Column({ type: 'bigint', nullable: false })
  sendAtTimestamp: number;

  @ManyToOne(() => Set, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'setId' })
  set: Set;

  @ManyToOne(() => Client, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'clientId' })
  client: Client;
}
