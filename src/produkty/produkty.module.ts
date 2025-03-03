import { Module } from '@nestjs/common';
import { ProduktyController } from './produkty.controller';
import { ProduktyService } from './produkty.service';
import { Produkt } from './produkty.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Produkt])],
  controllers: [ProduktyController],
  providers: [ProduktyService],
})
export class ProduktyModule {}
