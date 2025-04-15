import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from '../clients/clients.entity';
import { Comment } from '../comments/comments.entity';
import { ErrorsModule } from '../errors/errors.module';
import { Set } from '../sets/sets.entity';
import { SetsModule } from '../sets/sets.module';
import { Supplier } from '../suppliers/suppliers.entity';
import { PositionsController } from './positions.controller';
import { Position } from './positions.entity';
import { PositionsService } from './positions.service';
import { ImagesModule } from '../images/images.module';
import { SuppliersModule } from '../suppliers/suppliers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Position, Set, Client, Supplier, Comment]),
    ErrorsModule,
    forwardRef(() => SetsModule),
    forwardRef(() => SuppliersModule),
    forwardRef(() => ImagesModule),
  ],
  controllers: [PositionsController],
  providers: [PositionsService],
  exports: [PositionsService],
})
export class PositionsModule {}
