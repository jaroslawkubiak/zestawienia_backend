import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Zestawienie } from '../zestawienie/zestawienie.entity';
import { Client } from '../clients/clients.entity';
import { Supplier } from '../suppliers/suppliers.entity';
import { Comment } from '../comments/comments.entity';
import { Bookmark } from 'src/bookmarks/bookmarks.entity';

@Entity()
export class Pozycje {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 150, nullable: true })
  produkt: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  producent: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  kolekcja: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  nrKatalogowy: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  kolor: string;

  @Column({ nullable: true })
  ilosc: number;

  @Column({ type: 'double', nullable: true })
  netto: number;

  @Column({ type: 'double', nullable: true })
  brutto: number;

  @Column({ type: 'varchar', length: 200, nullable: true })
  pomieszczenie: string;

  @Column({ nullable: true })
  link: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  image: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  acceptedDate: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  acceptedTimeStamp: string;

  @OneToMany(() => Comment, (comment) => comment.zestawienie)
  comments: Comment[];

  @ManyToOne(() => Zestawienie, (zestawienie) => zestawienie.pozycje, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'zestawienieId', referencedColumnName: 'id' })
  zestawienie: Zestawienie;

  @ManyToOne(() => Bookmark, (bookmark) => bookmark.pozycje)
  @JoinColumn({ name: 'bookmarkId', referencedColumnName: 'id' })
  bookmark: Bookmark;

  @ManyToOne(() => Client, (klient) => klient.pozycje, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'clientId', referencedColumnName: 'id' })
  klient: Client;

  @ManyToOne(() => Supplier, (supplier) => supplier.pozycje, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'supplierId', referencedColumnName: 'id' })
  dostawca: Supplier;
}
