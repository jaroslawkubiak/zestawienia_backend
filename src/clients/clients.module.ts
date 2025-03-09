import { Module } from '@nestjs/common';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './clients.entity';
import { Position } from 'src/position/positions.entity';
import { Work } from 'src/work/work.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Client, Position, Work])],
  controllers: [ClientsController],
  providers: [ClientsService],
})
export class ClientsModule {}
