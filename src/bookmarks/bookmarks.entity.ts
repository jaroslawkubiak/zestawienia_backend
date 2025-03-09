import { Position } from 'src/position/positions.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Bookmark {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 150, nullable: false })
  nazwa: string;

  @OneToMany(() => Position, (positions) => positions.bookmark)
  position: Position[];
}
