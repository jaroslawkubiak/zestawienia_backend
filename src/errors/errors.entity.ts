import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Errors {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 20, nullable: false })
  type: string;
  // db, email, DDTO etc

  @Column({ type: 'text', nullable: false })
  message: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  url: string;

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
