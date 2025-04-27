import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Email } from '../email/email.entity';
import { Position } from '../position/positions.entity';

@Entity('')
export class Supplier {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 200, nullable: false, unique: true })
  company: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  firstName: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  lastName: string;

  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  telephone: string;

  @Column({ type: 'varchar', length: 40, nullable: false, unique: true })
  hash: string;

  @Column({ nullable: true })
  positionCount: number;

  @OneToMany(() => Position, (position) => position.supplierId)
  position: Position[];

  @OneToMany(() => Email, (email) => email.supplierId)
  logEmail: Email;
}
