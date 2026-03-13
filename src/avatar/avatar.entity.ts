import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('avatar')
export class Avatar {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'text', nullable: true })
  fileName: string;

  @Column({ type: 'text', nullable: true })
  path: string;

  @Column({ type: 'varchar', length: 5, nullable: false })
  type: string;
}
