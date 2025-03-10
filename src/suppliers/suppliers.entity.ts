import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Position } from '../position/positions.entity';

@Entity('')
export class Supplier {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 200, nullable: false, unique: true })
  firma: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  imie: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  nazwisko: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  telefon: string;

  @Column({ type: 'varchar', length: 100, nullable: true, unique: true })
  email: string;

  @OneToMany(() => Position, (position) => position.dostawca)
  position: Position[];
}
