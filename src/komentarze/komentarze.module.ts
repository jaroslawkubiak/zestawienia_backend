import { Module } from '@nestjs/common';
import { KomentarzeController } from './komentarze.controller';
import { KomentarzeService } from './komentarze.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Komentarze } from './komentarze.entity';
import { User } from 'src/user/user.entity';
import { Pozycje } from 'src/pozycje/pozycje.entity';
import { Zestawienie } from 'src/zestawienie/zestawienie.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Komentarze, User, Pozycje, Zestawienie])],
  controllers: [KomentarzeController],
  providers: [KomentarzeService],
})
export class KomentarzeModule {}
