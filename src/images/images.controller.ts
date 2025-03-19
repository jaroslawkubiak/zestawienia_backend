import {
  Body,
  Controller,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImagesService } from './images.service';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post(':setId/:positionId')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @Param('setId') setId: string,
    @Param('positionId') positionId: string,
    @Body('metadata') metadata: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    let parsedMetadata = null;
    let userId = 1; //default, if parse has error

    try {
      parsedMetadata = JSON.parse(metadata);
      userId = parsedMetadata?.userId;
    } catch (err) {
      console.warn('❌ Błąd parsowania JSON', err);
    }

    const { message, filename } =
      await this.imagesService.saveImage(+userId, +setId, +positionId, file);
    return {
      message,
      filename,
    };
  }
}
