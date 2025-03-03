import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Zestawienie } from '../zestawienie/zestawienie.entity';
import { Komentarze } from '../komentarze/komentarze.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 30, unique: true })
  username: string;

  @Column({ nullable: true })
  password: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  name: string;

  @OneToMany(() => Zestawienie, (zestawienie) => zestawienie.createdUser)
  createdZestawienia: Zestawienie[];

  @OneToMany(() => Zestawienie, (zestawienie) => zestawienie.updatedUser)
  updatedZestawienia: Zestawienie[];

  @OneToMany(() => Komentarze, (comment) => comment.createdByUser)
  komentarze: Komentarze[];
}
