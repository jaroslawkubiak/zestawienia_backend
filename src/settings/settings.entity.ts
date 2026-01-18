import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('setting')
export class Setting {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 150, nullable: false })
  value: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  type: string;
}
