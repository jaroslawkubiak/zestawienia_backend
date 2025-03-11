import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './comments.entity';
import { User } from '../user/user.entity';
import { Position } from '../position/positions.entity';
import { Set } from '../sets/sets.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, User, Position, Set])],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
