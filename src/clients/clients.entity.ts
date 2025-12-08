import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Email } from '../email/email.entity';
import { Set } from '../sets/sets.entity';

@Entity('')
export class Client {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'text', nullable: true })
  company: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  firstName: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  lastName: string;

  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  telephone: string;

  @Column({ nullable: true })
  setCount: number;

  @OneToMany(() => Set, (set) => set.clientId)
  set: Set[];

  @OneToMany(() => Email, (email) => email.clientId)
  logEmail: Email;

  @Column({ type: 'varchar', length: 40, nullable: false })
  hash: string;
}
