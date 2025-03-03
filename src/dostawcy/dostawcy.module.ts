import { Module } from '@nestjs/common';
import { DostawcyController } from './dostawcy.controller';
import { DostawcyService } from './dostawcy.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dostawca } from './dostawcy.entity';
import { Pozycje } from 'src/pozycje/pozycje.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Dostawca, Pozycje])],
  controllers: [DostawcyController],
  providers: [DostawcyService]
})
export class DostawcyModule {}
