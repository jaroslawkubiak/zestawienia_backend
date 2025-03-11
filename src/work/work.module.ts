import { Module } from '@nestjs/common';
import { WorkController } from './work.controller';
import { WorkService } from './work.service';
import { Work } from './work.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from '../clients/clients.entity';
import { Set } from '../sets/sets.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Work, Client, Set])],
  controllers: [WorkController],
  providers: [WorkService],
})
export class WorkModule {}
