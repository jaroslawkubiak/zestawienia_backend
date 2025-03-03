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
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  createDate: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  createTimeStamp: string;

  @Column({ type: 'text', nullable: true })
  tresc: string;

  @ManyToOne(() => Zestawienie, (zestawienie) => zestawienie.komentarze)
  @JoinColumn({ name: 'zestawienieId' })
  zestawienie: Zestawienie;

  @ManyToOne(() => Pozycje, (pozycje) => pozycje.komentarze)
  @JoinColumn({ name: 'pozycjaId' })
  pozycja: Pozycje;

  @ManyToOne(() => User, (user) => user.komentarze)
  @JoinColumn({ name: 'createdBy' })
  createdByUser: User;
}
