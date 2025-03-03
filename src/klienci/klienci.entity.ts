import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Pozycje } from '../pozycje/pozycje.entity';
import { PraceDoWykonania } from '../prace_do_wykonania/prace_do_wykonania.entity';

@Entity()
export class Klient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  nazwa: string;

  @Column({ nullable: true })
  imie: string;

  @Column({ nullable: true })
  nazwisko: string;

  @Column({ nullable: true })
  telefon: string;

  @Column({ nullable: true })
  email: string;

  @OneToMany(() => Pozycje, (pozycja) => pozycja.klient)
  pozycje: Pozycje[];

  @OneToMany(() => PraceDoWykonania, (prace) => prace.klient)
  praceDoWykonania: PraceDoWykonania[];
}
