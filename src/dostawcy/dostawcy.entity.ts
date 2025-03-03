import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Pozycje } from '../pozycje/pozycje.entity';

@Entity('dostawcy')
export class Dostawca {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 200, nullable: true, unique: true })
  nazwa: string;

  @OneToMany(() => Pozycje, (pozycja) => pozycja.dostawca)
  pozycje: Pozycje[];
}
