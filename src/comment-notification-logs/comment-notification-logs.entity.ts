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

  @Column({ type: 'varchar', length: 100, nullable: false })
  to: string;

  @Column({ type: 'varchar', length: 150, nullable: false })
  subject: string;

  @Column({
    type: 'enum',
    enum: ENotificationDirection,
    enumName: 'notification_direction_enum',
    nullable: false,
  })
  notificationDirection: ENotificationDirection;

  @Column({ type: 'text', nullable: false })
  content: any;

  @Column({ type: 'int', nullable: false })
  unreadComments: number;

  @Column({ type: 'int', nullable: false })
  needsAttentionComments: number;

  @ManyToOne(() => Set, (set) => set.email, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'setId', referencedColumnName: 'id' })
  setId: Set;

  @ManyToOne(() => Client, (client) => client.logEmail, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'clientId', referencedColumnName: 'id' })
  clientId?: Client | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  sendAt: string | null;

  @Column({ type: 'bigint', nullable: true })
  sendAtTimestamp: number | null;
}
