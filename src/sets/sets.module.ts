import { Module } from '@nestjs/common';
import { SetsController } from './sets.controller';
import { SetsService } from './sets.service';
import { Set } from './sets.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Position } from '../position/positions.entity';
import { Comment } from '../comments/comments.entity';
import { ErrorsModule } from '../errors/errors.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Set, User, Position, Comment, Error]),
    ErrorsModule,
  ],
  controllers: [SetsController],
  providers: [SetsService],
})
export class SetsModule {}
