import {
  Controller,
  Param,
  Post,
  Query,
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
    @Query('userId') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const { message, filename } = await this.imagesService.saveImage(
      +userId,
      +setId,
      +positionId,
      file,
    );
    
    return {
      message,
      filename,
      positionId,
    };
  }
}
