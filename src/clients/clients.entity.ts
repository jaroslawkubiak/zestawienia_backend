import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Comment } from '../comments/comments.entity';
import { Email } from '../email/email.entity';
import { Set } from '../sets/sets.entity';

@Entity('')
export class Client {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 200, nullable: false, unique: true })
  firma: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  imie: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  nazwisko: string;

  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  telefon: string;

  @Column({ nullable: true })
  setCount: number;

  @OneToMany(() => Set, (set) => set.clientId)
  set: Set[];

  @OneToMany(() => Email, (email) => email.clientId)
  logEmail: Email;

  @OneToMany(() => Comment, (comment) => comment.createdByClient)
  comments: Comment[];
}
