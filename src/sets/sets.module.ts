import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '../comments/comments.entity';
import { ErrorsModule } from '../errors/errors.module';
import { Position } from '../position/positions.entity';
import { PositionsModule } from '../position/positions.module';
import { User } from '../user/user.entity';
import { SetsController } from './sets.controller';
import { Set } from './sets.entity';
import { SetsService } from './sets.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Set, User, Position, Comment]),
    ErrorsModule,
    forwardRef(() => PositionsModule), // Używamy forwardRef, aby rozwiązać cykliczną zależność
  ],
  controllers: [SetsController],
  providers: [SetsService],
  exports: [SetsService],
})
export class SetsModule {}
