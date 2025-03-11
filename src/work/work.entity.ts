import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Set } from '../sets/sets.entity';
import { Client } from '../clients/clients.entity';

@Entity()
export class Work {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ nullable: true })
  rodzaj: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  jednostka: string;

  @Column({ type: 'double', nullable: true })
  ilosc: number;

  @Column({ type: 'double', nullable: true })
  netto: number;

  @Column({ type: 'double', nullable: true })
  brutto: number;

  @Column({ type: 'text', nullable: true })
  uwagi: string;

  @ManyToOne(() => Set, (set) => set.work, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'setId', referencedColumnName: 'id' })
  set: Set;

  @ManyToOne(() => Client, (client) => client.work, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'clientId', referencedColumnName: 'id' })
  clientId: Client;
}
