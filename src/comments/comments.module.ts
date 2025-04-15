import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ErrorsModule } from 'src/errors/errors.module';
import { Position } from '../position/positions.entity';
import { User } from '../user/user.entity';
import { CommentsController } from './comments.controller';
import { Comment } from './comments.entity';
import { CommentsService } from './comments.service';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, User, Position]), ErrorsModule],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
