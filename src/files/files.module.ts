import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule } from '../clients/clients.module';
import { ErrorsModule } from '../errors/errors.module';
import { FilesErrorsModule } from '../files-erros/files-erros.module';
import { FilesController } from './files.controller';
import { Files } from './files.entity';
import { FilesService } from './files.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Files]),
    ErrorsModule,
    FilesErrorsModule,
    forwardRef(() => ClientsModule),
  ],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
