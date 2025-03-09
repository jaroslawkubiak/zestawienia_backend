import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Zestawienie } from '../zestawienie/zestawienie.entity';
import { Comment } from '../comments/comments.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 30, unique: true })
  username: string;

  @Column({ nullable: false })
  password: string;

  @Column({ type: 'varchar', length: 30, nullable: false })
  name: string;

  @OneToMany(() => Zestawienie, (zestawienie) => zestawienie.createdUser)
  createdZestawienia: Zestawienie[];

  @OneToMany(() => Zestawienie, (zestawienie) => zestawienie.updatedUser)
  updatedZestawienia: Zestawienie[];

  @OneToMany(() => Comment, (comment) => comment.createdByUser)
  comments: Comment[];
}
