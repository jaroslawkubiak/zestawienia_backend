import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Zestawienie } from '../zestawienie/zestawienie.entity';
import { Pozycje } from '../pozycje/pozycje.entity';
import { User } from '../user/user.entity';
import { Client } from 'src/clients/clients.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  createDate: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  createTimeStamp: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  readed: string;

  @Column({ type: 'text', nullable: false })
  comment: string;

  @ManyToOne(() => Zestawienie, (zestawienie) => zestawienie.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'zestawienieId', referencedColumnName: 'id' })
  zestawienie: Zestawienie;

  @ManyToOne(() => Pozycje, (pozycje) => pozycje.comments, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'pozycjaId', referencedColumnName: 'id' })
  pozycja: Pozycje;

  @ManyToOne(() => User, (user) => user.comments, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  createdByUser: User;

  @ManyToOne(() => Client, (client) => client.comments, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'clientId', referencedColumnName: 'id' })
  createdByKlient: Client;
}
