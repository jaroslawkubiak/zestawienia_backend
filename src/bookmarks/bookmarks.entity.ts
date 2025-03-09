import { Pozycje } from 'src/pozycje/pozycje.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Bookmark {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 150, nullable: false })
  nazwa: string;

  @OneToMany(() => Pozycje, (pozycja) => pozycja.bookmark)
  pozycje: Pozycje[];
}
