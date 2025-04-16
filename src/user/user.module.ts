import { forwardRef, Module } from '@nestjs/common';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Set } from '../sets/sets.entity';
import { UserService } from './user.service';
import { CommentsModule } from '../comments/comments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Set]),
    forwardRef(() => CommentsModule),
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
