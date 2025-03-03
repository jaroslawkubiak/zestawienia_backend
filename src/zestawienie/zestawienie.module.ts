import { Module } from '@nestjs/common';
import { ZestawienieController } from './zestawienie.controller';
import { ZestawienieService } from './zestawienie.service';
import { Zestawienie } from './zestawienie.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { PraceDoWykonania } from 'src/prace_do_wykonania/prace_do_wykonania.entity';
import { Pozycje } from 'src/pozycje/pozycje.entity';
import { Komentarze } from 'src/komentarze/komentarze.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Zestawienie,
      User,
      PraceDoWykonania,
      Pozycje,
      Komentarze,
    ]),
  ],
  controllers: [ZestawienieController],
  providers: [ZestawienieService],
})
export class ZestawienieModule {}
