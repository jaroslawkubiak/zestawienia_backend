import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('files-errors')
export class FileErrors {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  file_name: string;

  @Column({ type: 'varchar', length: 255 })
  error_name: string;

  @Column({ type: 'text' })
  error_message: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  error_code: string;

  @Column({ type: 'longtext', nullable: true })
  stack: string;

  @Column({ type: 'json', nullable: true })
  raw_error: any;

  @Column({ type: 'varchar', length: 500, nullable: true })
  source_file: string;

  @Column({ type: 'int', nullable: true })
  source_line: number;

  @Column({ type: 'varchar', length: 255 })
  source_file_name: string;

  @Column({ type: 'varchar', length: 255 })
  source_file_function: string;

  @Column({ type: 'varchar', length: 40 })
  source_uuid: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  createdAt: Date;

  @Column({ type: 'varchar', length: 10 })
  user_id: string;

  @Column({ type: 'varchar', length: 10 })
  set_id: string;
}
