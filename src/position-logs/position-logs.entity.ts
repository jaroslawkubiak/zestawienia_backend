import {
  Column,
  Entity, PrimaryGeneratedColumn
} from 'typeorm';

@Entity('position-logs')
export class PositionLogs {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'int', nullable: false })
  positionId: number;

  @Column({ type: 'varchar', length: 200, nullable: false })
  image: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  createdAt: string | null;

  @Column({ type: 'bigint', nullable: true })
  createdAtTimestamp: number | null;
}
