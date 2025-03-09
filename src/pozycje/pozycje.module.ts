import { Module } from '@nestjs/common';
import { PozycjeController } from './pozycje.controller';
import { PozycjeService } from './pozycje.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pozycje } from './pozycje.entity';
import { Zestawienie } from 'src/zestawienie/zestawienie.entity';
import { Client } from 'src/clients/clients.entity';
import { Supplier } from 'src/suppliers/suppliers.entity';
import { Comment } from 'src/comments/comments.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pozycje, Zestawienie, Client, Supplier, Comment]),
  ],
  controllers: [PozycjeController],
  providers: [PozycjeService],
})
export class PozycjeModule {}
