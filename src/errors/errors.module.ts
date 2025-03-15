import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ErrorsService } from './errors.service';
import { Errors } from './errors.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Errors])],
  providers: [ErrorsService],
  exports: [ErrorsService],
})
export class ErrorsModule {}
