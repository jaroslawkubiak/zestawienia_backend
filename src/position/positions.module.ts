import { Module } from '@nestjs/common';
import { PositionsController } from './positions.controller';
import { PositionsService } from './positions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Position } from './positions.entity';
import { Set } from 'src/sets/sets.entity';
import { Client } from 'src/clients/clients.entity';
import { Supplier } from 'src/suppliers/suppliers.entity';
import { Comment } from 'src/comments/comments.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Position, Set, Client, Supplier, Comment]),
  ],
  controllers: [PositionsController],
  providers: [PositionsService],
})
export class PositionsModule {}
