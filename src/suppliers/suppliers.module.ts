import { forwardRef, Module } from '@nestjs/common';
import { SuppliersController } from './suppliers.controller';
import { SuppliersService } from './suppliers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supplier } from './suppliers.entity';
import { Position } from '../position/positions.entity';
import { PositionsModule } from '../position/positions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Supplier, Position]),
    forwardRef(() => PositionsModule),
  ],
  controllers: [SuppliersController],
  providers: [SuppliersService],
  exports: [SuppliersService],
})
export class SuppliersModule {}
