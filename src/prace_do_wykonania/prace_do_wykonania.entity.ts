import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Zestawienie } from '../zestawienie/zestawienie.entity';
import { Klient } from '../klienci/klienci.entity';

@Entity()
export class PraceDoWykonania {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Zestawienie, (zestawienie) => zestawienie.praceDoWykonania)
  @JoinColumn({ name: 'zestawienieId' })
  zestawienie: Zestawienie;

  @ManyToOne(() => Klient, (klient) => klient.praceDoWykonania)
  @JoinColumn({ name: 'klientId' })
  klient: Klient;

  @Column({ nullable: true })
  rodzaj: string;

  @Column({ nullable: true })
  jednostka: string;

  @Column({ nullable: true })
  ilosc: number;

  @Column({ nullable: true })
  netto: number;

  @Column({ nullable: true })
  brutto: number;

  @Column({ nullable: true })
  uwagi: string;
}
