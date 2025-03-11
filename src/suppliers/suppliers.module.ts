import { Module } from '@nestjs/common';
import { SuppliersController } from './suppliers.controller';
import { SuppliersService } from './suppliers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supplier } from './suppliers.entity';
import { Position } from '../position/positions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Supplier, Position])],
  controllers: [SuppliersController],
  providers: [SuppliersService],
})
export class SuppliersModule {}
