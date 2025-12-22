import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Bookmark } from '../bookmarks/bookmarks.entity';
import { Comment } from '../comments/comments.entity';
import { Set } from '../sets/sets.entity';
import { Supplier } from '../suppliers/suppliers.entity';
import { User } from '../user/user.entity';

@Entity('position')
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

  @Column({ type: 'double', nullable: true })
  netto: number;

  @Column({ type: 'double', nullable: true })
  brutto: number;

  @Column({ nullable: true })
  kolejnosc: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  pomieszczenie: string;

  @Column({ type: 'text', nullable: true })
  link: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  image: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  status: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  acceptedStatus: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  acceptedAt: string;

  @Column({ type: 'bigint', nullable: true })
  acceptedAtTimestamp: number | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  createdAt: string | null;

  @Column({ type: 'bigint', nullable: true })
  createdAtTimestamp: number | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  updatedAt: string | null;

  @Column({ type: 'bigint', nullable: true })
  updatedAtTimestamp: number | null;

  @OneToMany(() => Comment, (comment) => comment.positionId)
  comments: Comment[];

  @ManyToOne(() => Set, (set) => set.position, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'setId', referencedColumnName: 'id' })
  setId: Set;

  @ManyToOne(() => Bookmark, (bookmark) => bookmark.position)
  @JoinColumn({ name: 'bookmarkId', referencedColumnName: 'id' })
  bookmarkId: Bookmark;

  @ManyToOne(() => Supplier, (supplier) => supplier.position, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'supplierId', referencedColumnName: 'id' })
  supplierId?: Supplier | null;

  @ManyToOne(() => User, (user) => user.createdSet, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'createdBy', referencedColumnName: 'id' })
  createdBy: User;

  @ManyToOne(() => User, (user) => user.updatedSet, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'updatedBy', referencedColumnName: 'id' })
  updatedBy: User;
}
