import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Position } from '../position/positions.entity';
import { PositionsModule } from '../position/positions.module';
import { SetsModule } from '../sets/sets.module';
import { SupplierLogsModule } from '../supplier-logs/supplier-logs.module';
import { SuppliersController } from './suppliers.controller';
import { Supplier } from './suppliers.entity';
import { SuppliersService } from './suppliers.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Supplier, Position]),
    forwardRef(() => PositionsModule),
    forwardRef(() => SupplierLogsModule),
    forwardRef(() => SetsModule),
  ],
  controllers: [SuppliersController],
  providers: [SuppliersService],
  exports: [SuppliersService],
})
export class SuppliersModule {}
