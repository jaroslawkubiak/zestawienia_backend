import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Pozycje } from '../pozycje/pozycje.entity';

@Entity()
export class Dostawca {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  nazwa: string;

  @OneToMany(() => Pozycje, (pozycja) => pozycja.dostawca)
  pozycje: Pozycje[];
}
