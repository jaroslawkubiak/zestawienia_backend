import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule } from '../clients/clients.module';
import { SetsModule } from '../sets/sets.module';
import { SuppliersModule } from '../suppliers/suppliers.module';
import { SupplierLogs } from './supplier-logs.entity';
import { SupplierLogsService } from './supplier-logs.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SupplierLogs]),
    forwardRef(() => SetsModule),
    forwardRef(() => SuppliersModule),
    forwardRef(() => ClientsModule),
  ],
  providers: [SupplierLogsService],
  exports: [SupplierLogsService],
})
export class SupplierLogsModule {}
