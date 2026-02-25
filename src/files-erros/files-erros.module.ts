import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileErrors } from './files-errors.entity';
import { FilesErrorsService } from './files-erros.service';

@Module({
  imports: [TypeOrmModule.forFeature([FileErrors])],
  providers: [FilesErrorsService],
  exports: [FilesErrorsService],
})
export class FilesErrorsModule {}
