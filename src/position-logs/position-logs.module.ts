import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImagesModule } from '../images/images.module';
import { PositionLogs } from './position-logs.entity';
import { PositionLogsService } from './position-logs.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PositionLogs]),
    forwardRef(() => ImagesModule),
  ],
  providers: [PositionLogsService],
  exports: [PositionLogsService],
})
export class PositionLogsModule {}
