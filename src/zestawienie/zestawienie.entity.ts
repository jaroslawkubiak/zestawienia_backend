import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Pozycje } from '../pozycje/pozycje.entity';
import { PraceDoWykonania } from '../prace_do_wykonania/prace_do_wykonania.entity';
import { Komentarze } from '../komentarze/komentarze.entity';

@Entity()
export class Zestawienie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  numer: string;

  @ManyToOne(() => User, (user) => user.createdZestawienia)
  @JoinColumn({ name: 'createdBy' })
  createdUser: User;

  @ManyToOne(() => User, (user) => user.updatedZestawienia)
  @JoinColumn({ name: 'updatedBy' })
  updatedUser: User;

  @OneToMany(() => Pozycje, (pozycja) => pozycja.zestawienie)
  pozycje: Pozycje[];

  @OneToMany(() => PraceDoWykonania, (praca) => praca.zestawienie)
  praceDoWykonania: PraceDoWykonania[];

  @OneToMany(() => Komentarze, (comment) => comment.zestawienie)
  komentarze: Komentarze[];
}
