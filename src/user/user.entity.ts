import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Email } from '../email/email.entity';
import { Position } from '../position/positions.entity';
import { Set } from '../sets/sets.entity';
import { UserLogin } from '../user-login/user-login.entity';
import { Role } from './types/role';

@Entity()
export class User {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 30, unique: true })
  username: string;

  @Column({ nullable: false })
  password: string;

  @Column({
    type: 'enum',
    enum: ['admin', 'user'],
  })
  role: Role;

  @Column({ type: 'varchar', length: 30, nullable: false })
  name: string;

  @OneToMany(() => Set, (set) => set.createdBy)
  createdSet: Set[];

  @OneToMany(() => Set, (set) => set.updatedBy)
  updatedSet: Set[];

  @OneToMany(() => Position, (position) => position.createdBy)
  createdBy: Position[];

  @OneToMany(() => Position, (position) => position.updatedBy)
  updatedBy: Position[];

  @OneToMany(() => Email, (email) => email.sendBy)
  sendBy: Email[];

  @OneToMany(() => UserLogin, (login) => login.user)
  logins: UserLogin[];
}
