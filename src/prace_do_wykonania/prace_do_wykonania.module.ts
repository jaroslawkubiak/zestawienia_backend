import { Module } from '@nestjs/common';
import { PraceDoWykonaniaController } from './prace_do_wykonania.controller';
import { PraceDoWykonaniaService } from './prace_do_wykonania.service';
import { PraceDoWykonania } from './prace_do_wykonania.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from 'src/clients/clients.entity';
import { Zestawienie } from 'src/zestawienie/zestawienie.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PraceDoWykonania, Client, Zestawienie])],
  controllers: [PraceDoWykonaniaController],
  providers: [PraceDoWykonaniaService],
})
export class PraceDoWykonaniaModule {}
