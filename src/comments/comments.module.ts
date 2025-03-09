import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './comments.entity';
import { User } from 'src/user/user.entity';
import { Pozycje } from 'src/pozycje/pozycje.entity';
import { Zestawienie } from 'src/zestawienie/zestawienie.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, User, Pozycje, Zestawienie])],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
