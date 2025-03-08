import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Zestawienie } from '../zestawienie/zestawienie.entity';
import { Client } from '../clients/clients.entity';

@Entity()
export class PraceDoWykonania {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ nullable: true })
  rodzaj: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  jednostka: string;

  @Column({ type: 'double', nullable: true })
  ilosc: number;

  @Column({ type: 'double', nullable: true })
  netto: number;

  @Column({ type: 'double', nullable: true })
  brutto: number;

  @Column({ type: 'text', nullable: true })
  uwagi: string;

  @ManyToOne(() => Zestawienie, (zestawienie) => zestawienie.praceDoWykonania)
  @JoinColumn({ name: 'zestawienieId', referencedColumnName: 'id' })
  zestawienie: Zestawienie;

  @ManyToOne(() => Client, (klient) => klient.praceDoWykonania)
  @JoinColumn({ name: 'klientId', referencedColumnName: 'id' })
  klient: Client;
}
