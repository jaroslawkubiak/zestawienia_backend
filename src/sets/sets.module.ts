import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '../comments/comments.entity';
import { ErrorsModule } from '../errors/errors.module';
import { Position } from '../position/positions.entity';
import { User } from '../user/user.entity';
import { SetsController } from './sets.controller';
import { Set } from './sets.entity';
import { SetsService } from './sets.service';
import { PositionsModule } from '../position/positions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Set, User, Position, Comment]),
    ErrorsModule,
    PositionsModule,
  ],
  controllers: [SetsController],
  providers: [SetsService],
})
export class SetsModule {}
