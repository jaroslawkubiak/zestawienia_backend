import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Zestawienie } from '../zestawienie/zestawienie.entity';
import { Klient } from '../klienci/klienci.entity';
import { Dostawca } from '../dostawcy/dostawcy.entity';
import { Komentarze } from '../komentarze/komentarze.entity';

@Entity()
export class Pozycje {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Zestawienie, (zestawienie) => zestawienie.pozycje)
  @JoinColumn({ name: 'zestawienieId' })
  zestawienie: Zestawienie;

  @ManyToOne(() => Klient, (klient) => klient.pozycje)
  @JoinColumn({ name: 'klientId' })
  klient: Klient;

  @ManyToOne(() => Dostawca, (dostawca) => dostawca.pozycje)
  @JoinColumn({ name: 'dostawcaId' })
  dostawca: Dostawca;

  @Column({ nullable: true })
  produkt: string;

  @Column({ nullable: true })
  producent: string;

  @Column({ nullable: true })
  kolekcja: string;

  @Column({ nullable: true })
  nrKatalogowy: string;

  @Column({ nullable: true })
  kolor: string;

  @Column({ nullable: true })
  ilosc: number;

  @Column({ nullable: true })
  netto: number;

  @Column({ nullable: true })
  brutto: number;

  @Column({ nullable: true })
  pomieszczenie: string;

  @Column({ nullable: true })
  link: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  acceptedDate: string;

  @Column({ nullable: true })
  acceptedTimeStamp: string;

  @OneToMany(() => Komentarze, (comment) => comment.zestawienie)
  komentarze: Komentarze[];
}
