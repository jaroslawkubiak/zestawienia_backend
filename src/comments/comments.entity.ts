import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Set } from '../sets/sets.entity';
import { Position } from '../position/positions.entity';
import { User } from '../user/user.entity';
import { Client } from '../clients/clients.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  createdAt: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAtTimestamp: Date;

  @Column({ type: 'varchar', length: 10, nullable: true })
  readed: string;

  @Column({ type: 'text', nullable: false })
  comment: string;

  @ManyToOne(() => Position, (position) => position.comments, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'positionId', referencedColumnName: 'id' })
  positionId: Position;

  @ManyToOne(() => User, (user) => user.comments, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  createdByUser: User;

  @ManyToOne(() => Client, (client) => client.comments, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'clientId', referencedColumnName: 'id' })
  createdByClient: Client;
}
