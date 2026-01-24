import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Bookmark } from '../bookmarks/bookmarks.entity';
import { Client } from '../clients/clients.entity';
import { Comment } from '../comments/comments.entity';
import { Email } from '../email/email.entity';
import { Files } from '../files/files.entity';
import { Position } from '../position/positions.entity';
import { User } from '../user/user.entity';

@Entity('set')
export class Set {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 150, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: false })
  address: string;

  @Column({ type: 'varchar', length: 30, nullable: false, unique: true })
  hash: string;

  @Column({ type: 'json', nullable: false })
  bookmarks: any;

  @ManyToOne(() => Bookmark, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'lastBookmark' })
  lastBookmark: Bookmark;

  @Column({ type: 'varchar', length: 50, nullable: false })
  status: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  createdAt: string | null;

  @Column({ type: 'bigint', nullable: true })
  createdAtTimestamp: number | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  updatedAt: string | null;

  @Column({ type: 'bigint', nullable: true })
  updatedAtTimestamp: number | null;

  @ManyToOne(() => Client, (client) => client.set, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'clientId', referencedColumnName: 'id' })
  clientId: Client;

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

  @OneToMany(() => Position, (position) => position.setId, {
    onDelete: 'CASCADE',
  })
  position: Position[];

  @OneToMany(() => Email, (email) => email.setId, {
    onDelete: 'CASCADE',
  })
  email: Email[];

  @OneToMany(() => Comment, (comment) => comment.setId)
  comments: Comment[];

  @OneToMany(() => Files, (file) => file.setId)
  files: Files[];
}
