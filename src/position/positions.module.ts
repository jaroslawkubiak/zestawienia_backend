import { Module } from '@nestjs/common';
import { PositionsController } from './positions.controller';
import { PositionsService } from './positions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Position } from './positions.entity';
import { Set } from '../sets/sets.entity';
import { Client } from '../clients/clients.entity';
import { Supplier } from '../suppliers/suppliers.entity';
import { Comment } from '../comments/comments.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Position, Set, Client, Supplier, Comment]),
  ],
  controllers: [PositionsController],
  providers: [PositionsService],
})
export class PositionsModule {}
