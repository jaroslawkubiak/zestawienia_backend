import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Client } from '../clients/clients.entity';
import { Email } from '../email/email.entity';
import { Position } from '../position/positions.entity';
import { User } from '../user/user.entity';
import { Comment } from '../comments/comments.entity';
import { Files } from 'src/files/files.entity';

@Entity()
export class Set {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 150, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: false })
  address: string;

  @Column({ type: 'varchar', length: 40, nullable: false, unique: true })
  hash: string;

  @Column({ type: 'json', nullable: false })
  bookmarks: any;

  @Column({ type: 'varchar', length: 50, nullable: false })
  status: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  createdAt: string;

  @Column({ type: 'bigint', nullable: false })
  createdAtTimestamp: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  updatedAt: string;

  @Column({ type: 'bigint', nullable: false })
  updatedAtTimestamp: number;

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
