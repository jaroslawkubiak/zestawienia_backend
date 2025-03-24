import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Position } from '../position/positions.entity';
import { ClientsController } from './clients.controller';
import { Client } from './clients.entity';
import { ClientsService } from './clients.service';
import { ErrorsModule } from '../errors/errors.module';
import { SetsModule } from '../sets/sets.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Client, Position]),
    ErrorsModule,
    forwardRef(() => SetsModule),
  ],
  controllers: [ClientsController],
  providers: [ClientsService],
  exports: [ClientsService],
})
export class ClientsModule {}
