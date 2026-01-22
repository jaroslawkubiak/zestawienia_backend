import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule } from '../clients/clients.module';
import { EmailModule } from '../email/email.module';
import { ErrorsModule } from '../errors/errors.module';
import { Position } from '../position/positions.entity';
import { SetsModule } from '../sets/sets.module';
import { SettingsModule } from '../settings/settings.module';
import { User } from '../user/user.entity';
import { UserModule } from '../user/user.module';
import { CommentsController } from './comments.controller';
import { Comment } from './comments.entity';
import { CommentsService } from './comments.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, User, Position]),
    ErrorsModule,
    forwardRef(() => UserModule),
    forwardRef(() => SettingsModule),
    forwardRef(() => ClientsModule),
    forwardRef(() => SetsModule),
    forwardRef(() => EmailModule),
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
