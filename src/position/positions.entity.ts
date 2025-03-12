import { Bookmark } from '../bookmarks/bookmarks.entity';
import { User } from '../user/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Client } from '../clients/clients.entity';
import { Comment } from '../comments/comments.entity';
import { Set } from '../sets/sets.entity';
import { Supplier } from '../suppliers/suppliers.entity';

@Entity()
export class Position {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  produkt: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  producent: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  kolekcja: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  nrKatalogowy: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  kolor: string;

  @Column({ nullable: true })
  ilosc: number;

  @Column({ nullable: true })
  kolejnosc: number;

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

  @OneToMany(() => Comment, (comment) => comment.set)
  comments: Comment[];

  @ManyToOne(() => Set, (set) => set.position, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'setId', referencedColumnName: 'id' })
  set: Set;

  @ManyToOne(() => Bookmark, (bookmark) => bookmark.position)
  @JoinColumn({ name: 'bookmarkId', referencedColumnName: 'id' })
  bookmark: Bookmark;

  @ManyToOne(() => Client, (client) => client.position, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'clientId', referencedColumnName: 'id' })
  clientId: Client;

  @ManyToOne(() => Supplier, (supplier) => supplier.position, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'supplierId', referencedColumnName: 'id' })
  dostawca: Supplier;

  @ManyToOne(() => User, (user) => user.createdPosition, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  createdPosition: Supplier;
}
