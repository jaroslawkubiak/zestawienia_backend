import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Position } from 'src/position/positions.entity';
import { Work } from 'src/work/work.entity';
import { ClientsController } from './clients.controller';
import { Client } from './clients.entity';
import { ClientsService } from './clients.service';

@Module({
  imports: [TypeOrmModule.forFeature([Client, Position, Work])],
  controllers: [ClientsController],
  providers: [ClientsService],
})
export class ClientsModule {}
