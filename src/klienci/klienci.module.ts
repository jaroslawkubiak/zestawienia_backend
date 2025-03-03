import { Module } from '@nestjs/common';
import { KlienciController } from './klienci.controller';
import { KlienciService } from './klienci.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Klient } from './klienci.entity';
import { Pozycje } from 'src/pozycje/pozycje.entity';
import { PraceDoWykonania } from 'src/prace_do_wykonania/prace_do_wykonania.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Klient, Pozycje, PraceDoWykonania])],
  controllers: [KlienciController],
  providers: [KlienciService],
})
export class KlienciModule {}
