import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Set } from '../sets/sets.entity';

@Entity()
export class Files {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  fileName: string;

  @Column({ type: 'varchar', length: 10, nullable: false })
  type: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  path: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  dir: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  description: string;

  @Column({ type: 'int', nullable: false })
  size: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  createdAt: string;

  @Column({ type: 'bigint', nullable: false })
  createdAtTimestamp: number;

  @ManyToOne(() => Set, (set) => set.files, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'setId', referencedColumnName: 'id' })
  setId: Set;
}
