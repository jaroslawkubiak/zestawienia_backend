import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Produkt {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  kolumna: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  nazwa: string;
}
