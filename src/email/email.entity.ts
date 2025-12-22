import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Client } from '../clients/clients.entity';
import { Set } from '../sets/sets.entity';
import { Supplier } from '../suppliers/suppliers.entity';
import { User } from '../user/user.entity';

@Entity('email')
export class Email {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  to: string;

  @Column({ type: 'varchar', length: 150, nullable: false })
  subject: string;

  @Column({ type: 'text', nullable: false })
  content: any;

  @Column({ type: 'text', nullable: false })
  link: string;

  @ManyToOne(() => Set, (set) => set.email, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'setId', referencedColumnName: 'id' })
  setId: Set;

  @ManyToOne(() => Client, (client) => client.logEmail, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'clientId', referencedColumnName: 'id' })
  clientId?: Client | null;

  @ManyToOne(() => Supplier, (supplier) => supplier.logEmail, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'supplierId', referencedColumnName: 'id' })
  supplierId?: Supplier | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  sendAt: string | null;

  @Column({ type: 'bigint', nullable: true })
  sendAtTimestamp: number | null;

  @ManyToOne(() => User, (user) => user.sendBy, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'sendBy', referencedColumnName: 'id' })
  sendBy: User;
}
