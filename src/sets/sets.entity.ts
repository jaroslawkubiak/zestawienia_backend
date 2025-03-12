import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Client } from '../clients/clients.entity';
import { Position } from '../position/positions.entity';
import { User } from '../user/user.entity';

@Entity()
export class Set {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 150, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  status: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  createdAt: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAtTimestamp: Date;

  @Column({ type: 'varchar', length: 50, nullable: false })
  updatedAt: Date;

  @CreateDateColumn({ type: 'timestamp' })
  updatedAtTimestamp: Date;

  @Column({ type: 'varchar', length: 40, nullable: false })
  hash: string;

  @Column({ type: 'json', nullable: false })
  bookmarks: any;

  @ManyToOne(() => Client, (client) => client.set, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'clientId', referencedColumnName: 'id' })
  clientId: Client;

  @ManyToOne(() => User, (user) => user.createdSet, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'createdBy', referencedColumnName: 'id' })
  createdBy: User;

  @ManyToOne(() => User, (user) => user.updatedSet, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'updatedBy', referencedColumnName: 'id' })
  updatedBy: User;

  @OneToMany(() => Position, (position) => position.setId)
  position: Position[];
}
