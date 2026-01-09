import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Set } from '../sets/sets.entity';

@Entity('files')
export class Files {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  fileName: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  thumbnail: string;

  @Column({ type: 'varchar', length: 10, nullable: false })
  type: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  path: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  dir: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  originalName: string;

  @Column({ type: 'int', nullable: false })
  size: number;

  @Column({ type: 'int', nullable: true })
  width: number;

  @Column({ type: 'int', nullable: true })
  height: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  createdAt: string | null;

  @Column({ type: 'bigint', nullable: true })
  createdAtTimestamp: number | null;

  @ManyToOne(() => Set, (set) => set.files, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'setId', referencedColumnName: 'id' })
  setId: Set;
}
