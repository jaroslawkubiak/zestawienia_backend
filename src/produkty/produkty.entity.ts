import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Produkt {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  kolumna: string;

  @Column({ type: 'varchar', length: 150, nullable: false })
  nazwa: string;
}
