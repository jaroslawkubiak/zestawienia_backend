import { Position } from 'src/position/positions.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Comment } from '../comments/comments.entity';
import { Set } from '../sets/sets.entity';

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

  @OneToMany(() => Set, (set) => set.createdBy)
  createdSet: Set[];

  @OneToMany(() => Set, (set) => set.updatedBy)
  updatedSet: Set[];

  @OneToMany(() => Position, (position) => position.createdPosition)
  createdPosition: Set[];

  @OneToMany(() => Comment, (comment) => comment.createdByUser)
  comments: Comment[];
}
