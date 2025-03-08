import { Module } from '@nestjs/common';
import { PozycjeController } from './pozycje.controller';
import { PozycjeService } from './pozycje.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pozycje } from './pozycje.entity';
import { Zestawienie } from 'src/zestawienie/zestawienie.entity';
import { Client } from 'src/clients/clients.entity';
import { Supplier } from 'src/suppliers/suppliers.entity';
import { Komentarze } from 'src/komentarze/komentarze.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Pozycje,
      Zestawienie,
      Client,
      Supplier,
      Komentarze,
    ]),
  ],
  controllers: [PozycjeController],
  providers: [PozycjeService],
})
export class PozycjeModule {}
