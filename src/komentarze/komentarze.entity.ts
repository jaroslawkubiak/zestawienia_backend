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
export class Komentarze {
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

  @ManyToOne(() => Zestawienie, (zestawienie) => zestawienie.komentarze, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'zestawienieId', referencedColumnName: 'id' })
  zestawienie: Zestawienie;

  @ManyToOne(() => Pozycje, (pozycje) => pozycje.komentarze)
  @JoinColumn({ name: 'pozycjaId', referencedColumnName: 'id' })
  pozycja: Pozycje;

  @ManyToOne(() => User, (user) => user.komentarze)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  createdByUser: User;

  @ManyToOne(() => Client, (klient) => klient.komentarze)
  @JoinColumn({ name: 'klientId', referencedColumnName: 'id' })
  createdByKlient: Client;
}
