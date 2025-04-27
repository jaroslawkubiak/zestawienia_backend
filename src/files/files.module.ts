import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ErrorsModule } from 'src/errors/errors.module';
import { Files } from './files.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Files]), ErrorsModule],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
