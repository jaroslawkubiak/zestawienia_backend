import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Pozycje } from '../pozycje/pozycje.entity';
import { PraceDoWykonania } from '../prace_do_wykonania/prace_do_wykonania.entity';
import { Comment } from '../comments/comments.entity';
import { Client } from 'src/clients/clients.entity';

@Entity()
export class Zestawienie {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  numer: string;

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

  @ManyToOne(() => Client, (klient) => klient.zestawienia, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'clientId', referencedColumnName: 'id' })
  klient: Client;

  @ManyToOne(() => User, (user) => user.createdZestawienia, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'createdBy', referencedColumnName: 'id' })
  createdUser: User;

  @ManyToOne(() => User, (user) => user.updatedZestawienia, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'updatedBy', referencedColumnName: 'id' })
  updatedUser: User;

  @OneToMany(() => Pozycje, (pozycja) => pozycja.zestawienie)
  pozycje: Pozycje[];

  @OneToMany(() => PraceDoWykonania, (praca) => praca.zestawienie)
  praceDoWykonania: PraceDoWykonania[];

  @OneToMany(() => Comment, (comment) => comment.zestawienie)
  comments: Comment[];
}
