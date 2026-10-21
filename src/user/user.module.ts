import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsModule } from '../comments/comments.module';
import { ClientSet } from '../sets/sets.entity';
import { User } from './user.entity';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, ClientSet]),
    forwardRef(() => CommentsModule),
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
