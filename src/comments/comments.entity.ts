import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Position } from '../position/positions.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'text', nullable: false })
  comment: string;

  @Column({ type: 'enum', enum: ['client', 'user'] })
  authorType: 'client' | 'user';

  @Column({ type: 'int' })
  authorId: number;

  @Column({ type: 'boolean', default: false })
  readByReceiver: boolean;

  @Column({ type: 'varchar', length: 50, nullable: false })
  createdAt: string;

  @Column({ type: 'bigint', nullable: false })
  createdAtTimestamp: number;

  @ManyToOne(() => Position, (position) => position.comments, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'positionId', referencedColumnName: 'id' })
  positionId: Position;
}
