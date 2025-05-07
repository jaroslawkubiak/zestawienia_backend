import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsModule } from '../comments/comments.module';
import { ErrorsModule } from '../errors/errors.module';
import { PositionsModule } from '../position/positions.module';
import { SetsModule } from '../sets/sets.module';
import { EmailController } from './email.controller';
import { Email } from './email.entity';
import { EmailService } from './email.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Email]),
    ErrorsModule,
    forwardRef(() => CommentsModule),
    forwardRef(() => SetsModule),
    forwardRef(() => PositionsModule),
  ],
  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
