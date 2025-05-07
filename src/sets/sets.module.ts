import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule } from '../clients/clients.module';
import { Comment } from '../comments/comments.entity';
import { CommentsModule } from '../comments/comments.module';
import { EmailModule } from '../email/email.module';
import { ErrorsModule } from '../errors/errors.module';
import { FilesModule } from '../files/files.module';
import { ImagesModule } from '../images/images.module';
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
    FilesModule,
    forwardRef(() => ImagesModule),
    forwardRef(() => CommentsModule),
    forwardRef(() => PositionsModule),
    forwardRef(() => ClientsModule),
    forwardRef(() => EmailModule),
  ],
  controllers: [SetsController],
  providers: [SetsService],
  exports: [SetsService],
})
export class SetsModule {}
