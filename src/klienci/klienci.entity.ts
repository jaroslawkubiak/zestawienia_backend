import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Pozycje } from '../pozycje/pozycje.entity';
import { PraceDoWykonania } from '../prace_do_wykonania/prace_do_wykonania.entity';
import { Zestawienie } from 'src/zestawienie/zestawienie.entity';

@Entity('klienci')
export class Klient {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 200, nullable: true, unique: true })
  firma: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  imie: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  nazwisko: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  telefon: string;

  @Column({ type: 'varchar', length: 100, nullable: true, unique: true })
  email: string;

  @OneToMany(() => Zestawienie, (zestawienie) => zestawienie.klient)
  zestawienia: Zestawienie[];

  @OneToMany(() => Pozycje, (pozycja) => pozycja.klient)
  pozycje: Pozycje[];

  @OneToMany(() => PraceDoWykonania, (prace) => prace.klient)
  praceDoWykonania: PraceDoWykonania[];
}
