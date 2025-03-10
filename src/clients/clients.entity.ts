import { Comment } from 'src/comments/comments.entity';
import { Set } from 'src/sets/sets.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Position } from '../position/positions.entity';
import { Work } from '../work/work.entity';

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

  @OneToMany(() => Set, (set) => set.client)
  set: Set[];

  @OneToMany(() => Position, (position) => position.client)
  position: Position[];

  @OneToMany(() => Work, (work) => work.client)
  work: Work[];

  @OneToMany(() => Comment, (comment) => comment.createdByClient)
  comments: Comment[];
}
