import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from '../clients/clients.entity';
import { ClientSet } from '../sets/sets.entity';
import { Supplier } from '../suppliers/suppliers.entity';
import { HashService } from './hash.service';

@Module({
  imports: [TypeOrmModule.forFeature([ClientSet, Client, Supplier])],
  providers: [HashService],
  exports: [HashService],
})
export class HashModule {}
