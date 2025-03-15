import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Errors {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 20, nullable: false })
  type: string;
  // db, email etc

  @Column({ type: 'varchar', length: 255, nullable: false })
  message: string;

  @Column({ type: 'text', nullable: false })
  error: string;

  @Column({ type: 'text', nullable: false })
  query: string;

  @Column({ type: 'text', nullable: false })
  parameters: string;

  @Column({ type: 'text', nullable: false })
  sql: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  createdAt: string;

  @Column({ type: 'bigint', nullable: false })
  createdAtTimestamp: number;
}
