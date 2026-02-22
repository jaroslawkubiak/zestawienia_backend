import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsModule } from '../comments/comments.module';
import { ErrorsModule } from '../errors/errors.module';
import { HashModule } from '../hash/hash.module';
import { Position } from '../position/positions.entity';
import { ClientsController } from './clients.controller';
import { Client } from './clients.entity';
import { ClientsService } from './clients.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Client, Position]),
    ErrorsModule,
    HashModule,
    forwardRef(() => CommentsModule),
  ],
  controllers: [ClientsController],
  providers: [ClientsService],
  exports: [ClientsService],
})
export class ClientsModule {}
