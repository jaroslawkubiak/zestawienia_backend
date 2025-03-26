import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Errors {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 20, nullable: false })
  type: string;

  @Column({ type: 'text', nullable: false })
  message: string;

  @Column({ type: 'text', nullable: false })
  error: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  url?: string | null;

  @Column({ type: 'text', nullable: true })
  query?: string | null;

  @Column({ type: 'text', nullable: true })
  parameters?: string | null;

  @Column({ type: 'text', nullable: true })
  sql?: string | null;

  @Column({ type: 'int', nullable: true })
  setId?: number | null;

  @Column({ type: 'int', nullable: true })
  recipientId?: number | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  recipientEmail?: string | null;

  @Column({ type: 'text', nullable: true })
  link?: string | null;

  @Column({ type: 'varchar', length: 50, nullable: false })
  createdAt: string;

  @Column({ type: 'bigint', nullable: false })
  createdAtTimestamp: number;
}
