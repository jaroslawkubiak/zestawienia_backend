import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Position } from '../position/positions.entity';
import { Work } from '../work/work.entity';
import { Set } from 'src/sets/sets.entity';
import { Comment } from 'src/comments/comments.entity';

@Entity('')
export class Client {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 200, nullable: false, unique: true })
  firma: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  imie: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  nazwisko: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  telefon: string;

  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  email: string;

  @OneToMany(() => Set, (set) => set.klient)
  set: Set[];

  @OneToMany(() => Position, (position) => position.klient)
  position: Position[];

  @OneToMany(() => Work, (work) => work.klient)
  work: Work[];

  @OneToMany(() => Comment, (comment) => comment.createdByKlient)
  comments: Comment[];
}
