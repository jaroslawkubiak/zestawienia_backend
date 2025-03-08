import { Module } from '@nestjs/common';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './clients.entity';
import { Pozycje } from 'src/pozycje/pozycje.entity';
import { PraceDoWykonania } from 'src/prace_do_wykonania/prace_do_wykonania.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Client, Pozycje, PraceDoWykonania])],
  controllers: [ClientsController],
  providers: [ClientsService],
})
export class ClientsModule {}
