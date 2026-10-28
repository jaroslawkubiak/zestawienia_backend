import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('position-logs')
@Index('IDX_position_logs_uploadId', ['uploadId'])
@Index('IDX_position_logs_positionId_createdAtTimestamp', [
  'positionId',
  'createdAtTimestamp',
])
export class PositionLogs {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 36, nullable: true })
  uploadId: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  event: string | null;

  @Column({ type: 'int', nullable: false })
  positionId: number;

  @Column({ type: 'int', nullable: true })
  userId: number | null;

  @Column({ type: 'int', nullable: true })
  setId: number | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  image: string | null;

  @Column({ type: 'json', nullable: true })
  details: Record<string, unknown> | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  createdAt: string | null;

  @Column({ type: 'bigint', nullable: true })
  createdAtTimestamp: number | null;

  @Column({ type: 'text', nullable: true })
  logs: string | null;
}
