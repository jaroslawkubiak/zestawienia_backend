import { Position } from '../position/positions.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Bookmark {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 150, nullable: false })
  nazwa: string;

  @Column({ type: 'boolean', default: true })
  default: boolean;

  @OneToMany(() => Position, (positions) => positions.bookmark)
  position: Position[];
}
