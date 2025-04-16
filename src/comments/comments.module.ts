import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule } from '../clients/clients.module';
import { ErrorsModule } from '../errors/errors.module';
import { Position } from '../position/positions.entity';
import { SetsModule } from '../sets/sets.module';
import { User } from '../user/user.entity';
import { CommentsController } from './comments.controller';
import { Comment } from './comments.entity';
import { CommentsService } from './comments.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, User, Position]),
    ErrorsModule,
    forwardRef(() => UserModule),
    forwardRef(() => ClientsModule),
    forwardRef(() => SetsModule),
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
