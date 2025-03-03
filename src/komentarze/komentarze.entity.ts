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

@Entity()
export class Komentarze {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Zestawienie, (zestawienie) => zestawienie.komentarze)
  @JoinColumn({ name: 'zestawienieId' })
  zestawienie: Zestawienie;

  @ManyToOne(() => Pozycje, (pozycje) => pozycje.komentarze)
  @JoinColumn({ name: 'pozycjaId' })
  pozycja: Pozycje;

  @ManyToOne(() => User, (user) => user.komentarze)
  @JoinColumn({ name: 'createdBy' })
  createdByUser: User;

  @Column({ nullable: true })
  createDate: string;

  @Column({ nullable: true })
  createTimeStamp: string;

  @Column({ nullable: true })
  tresc: string;
}
