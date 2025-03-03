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
import { Klient } from 'src/klienci/klienci.entity';

@Entity()
export class Zestawienie {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  numer: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  createDate: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  createTimeStamp: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  updateDate: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  updateTimeStamp: string;

  @ManyToOne(() => Klient, (klient) => klient.zestawienia)
  @JoinColumn({ name: 'klientId' })
  klient: Klient;

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
