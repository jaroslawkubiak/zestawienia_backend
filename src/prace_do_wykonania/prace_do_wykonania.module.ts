import { Module } from '@nestjs/common';
import { PraceDoWykonaniaController } from './prace_do_wykonania.controller';
import { PraceDoWykonaniaService } from './prace_do_wykonania.service';
import { PraceDoWykonania } from './prace_do_wykonania.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Klient } from 'src/klienci/klienci.entity';
import { Zestawienie } from 'src/zestawienie/zestawienie.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PraceDoWykonania, Klient, Zestawienie])],
  controllers: [PraceDoWykonaniaController],
  providers: [PraceDoWykonaniaService],
})
export class PraceDoWykonaniaModule {}
