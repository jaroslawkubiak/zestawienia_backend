import { Module } from '@nestjs/common';
import { SuppliersController } from './suppliers.controller';
import { SuppliersService } from './suppliers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supplier } from './suppliers.entity';
import { Pozycje } from 'src/pozycje/pozycje.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Supplier, Pozycje])],
  controllers: [SuppliersController],
  providers: [SuppliersService],
})
export class SuppliersModule {}
