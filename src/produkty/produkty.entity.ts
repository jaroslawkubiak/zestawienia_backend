import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Produkt {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  kolumna: string;

  @Column({ nullable: true })
  nazwa: string;
}
