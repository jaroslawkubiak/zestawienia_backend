import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Client } from '../clients/clients.entity';
import { Set } from '../sets/sets.entity';

@Entity('client-logs')
export class ClientLogs {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'tinyint', width: 1 })
  success: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  client_name: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  req_setHash: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  req_clientHash: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  date: Date;

  @Column({ type: 'bigint', nullable: false })
  timestamp: number;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ip_address: string | null;

  @Column({ type: 'text', nullable: true })
  user_agent: string | null;

  @ManyToOne(() => Set, (set) => set.position, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'setId', referencedColumnName: 'id' })
  set: Set;

  @ManyToOne(() => Client, (client) => client.clientLogs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'clientId', referencedColumnName: 'id' })
  client: Client;
}
