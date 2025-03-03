import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Zestawienie } from '../zestawienie/zestawienie.entity';
import { Komentarze } from '../komentarze/komentarze.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  name: string;

  // Relacja z Zestawienie dla createdBy
  @OneToMany(() => Zestawienie, (zestawienie) => zestawienie.createdUser)
  createdZestawienia: Zestawienie[];

  // Relacja z Zestawienie dla updatedBy
  @OneToMany(() => Zestawienie, (zestawienie) => zestawienie.updatedUser)
  updatedZestawienia: Zestawienie[];

  @OneToMany(() => Komentarze, (comment) => comment.createdByUser)
  komentarze: Komentarze[];
}
