import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  kolumna: string;

  @Column({ type: 'varchar', length: 150, nullable: false })
  nazwa: string;
}
