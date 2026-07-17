import { forwardRef, Module } from '@nestjs/common';
import { PositionLogsModule } from '../position-logs/position-logs.module';
import { PositionsModule } from '../position/positions.module';
import { SetsModule } from '../sets/sets.module';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';

@Module({
  imports: [
    forwardRef(() => SetsModule),
    forwardRef(() => PositionsModule),
    forwardRef(() => PositionLogsModule),
  ],
  controllers: [ImagesController],
  providers: [ImagesService],
  exports: [ImagesService],
})
export class ImagesModule {}
