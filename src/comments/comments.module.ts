import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './comments.entity';
import { User } from 'src/user/user.entity';
import { Position } from 'src/position/positions.entity';
import { Set } from 'src/sets/sets.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, User, Position, Set])],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
