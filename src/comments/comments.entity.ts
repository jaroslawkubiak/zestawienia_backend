import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Position } from '../position/positions.entity';
import { Set } from '../sets/sets.entity';

@Entity('comment')
export class Comment {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'text', nullable: false })
  comment: string;

  @Column({ type: 'enum', enum: ['client', 'user'] })
  authorType: 'client' | 'user';

  @Column({ type: 'int' })
  authorId: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  authorName: string;

  @Column({ type: 'timestamp', nullable: true })
  seenAt: Date | null;

  @Column({ type: 'boolean', default: false })
  needsAttention: boolean;

  @Column({ type: 'varchar', length: 50, nullable: true })
  createdAt: string | null;

  @Column({ type: 'bigint', nullable: true })
  createdAtTimestamp: number | null;

  @ManyToOne(() => Position, (position) => position.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'positionId', referencedColumnName: 'id' })
  positionId: Position;

  @ManyToOne(() => Set, (set) => set.comments, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'setId', referencedColumnName: 'id' })
  setId: Set;
}
