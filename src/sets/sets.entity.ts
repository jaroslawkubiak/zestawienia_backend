import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Position } from '../position/positions.entity';
import { Work } from '../work/work.entity';
import { Comment } from '../comments/comments.entity';
import { Client } from 'src/clients/clients.entity';

@Entity()
export class Set {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  numer: string;
  
  @Column({ type: 'varchar', length: 50, nullable: false })
  status: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  createDate: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  createTimeStamp: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  updateDate: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  updateTimeStamp: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  hash: string;

  @ManyToOne(() => Client, (klient) => klient.set, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'clientId', referencedColumnName: 'id' })
  klient: Client;

  @ManyToOne(() => User, (user) => user.createdSet, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'createdBy', referencedColumnName: 'id' })
  createdUser: User;

  @ManyToOne(() => User, (user) => user.updatedSet, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'updatedBy', referencedColumnName: 'id' })
  updatedUser: User;

  @OneToMany(() => Position, (position) => position.set)
  position: Position[];

  @OneToMany(() => Work, (praca) => praca.set)
  work: Work[];

  @OneToMany(() => Comment, (comment) => comment.set)
  comments: Comment[];
}
