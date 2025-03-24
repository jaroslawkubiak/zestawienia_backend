import { forwardRef, Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { SetsModule } from '../sets/sets.module';
import { PositionsModule } from '../position/positions.module';

@Module({
  imports: [forwardRef(() => SetsModule), forwardRef(() => PositionsModule)],
  controllers: [ImagesController],
  providers: [ImagesService],
  exports: [ImagesService],
})
export class ImagesModule {}
