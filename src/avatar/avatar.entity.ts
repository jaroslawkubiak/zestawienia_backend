import { Client } from 'src/clients/clients.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('avatar')
export class Avatar {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'text', nullable: true })
  fileName: string;

  @Column({ type: 'text', nullable: true })
  path: string;

  @Column({ type: 'varchar', length: 5, nullable: false })
  type: string;

  @ManyToOne(() => Client, (client) => client.avatars, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'clientId' })
  client: Client;
}
