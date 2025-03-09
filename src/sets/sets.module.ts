import { Module } from '@nestjs/common';
import { SetsController } from './sets.controller';
import { setsService } from './sets.service';
import { Set } from './sets.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Work } from 'src/work/work.entity';
import { Position } from 'src/position/positions.entity';
import { Comment } from 'src/comments/comments.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Set, User, Work, Position, Comment])],
  controllers: [SetsController],
  providers: [setsService],
})
export class SetsModule {}
