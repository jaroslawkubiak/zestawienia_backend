import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { createImageThumbnail } from 'src/helpers/createImageThumbnail';
import { PositionsService } from '../position/positions.service';
import { ISavedFiles } from './types/ISavedFiles';

@Injectable()
export class ImagesService {
  constructor(
    @Inject(forwardRef(() => PositionsService))
    private readonly positionsService: PositionsService,
  ) {}

  async saveImage(
    userId: number,
    setId: number,
    setHash: string,
    positionId: number,
    file: Express.Multer.File,
  ): Promise<ISavedFiles> {
    if (!file) {
      throw new Error('Plik nie został przesłany');
    }
    const innerPath = `/sets/${setId}/${setHash}/positions/${positionId}`;

    const basePath = process.env.UPLOAD_PATH || 'uploads';
    const uploadPath = path.join(process.cwd(), basePath + innerPath);

    try {
      this.removeFolderContent(uploadPath);

      fs.mkdirSync(uploadPath, { recursive: true });

      let filename = `${positionId}--${Date.now()}--${file.originalname}`;
      const filePath = path.join(uploadPath, filename);

      // save original file
      fs.writeFileSync(filePath, file.buffer);

      // generating thumbnail
      await createImageThumbnail(file, filename, uploadPath);

      // save filename (org or mini) in db
      const res = await this.positionsService.updateImage(
        userId,
        setId,
        setHash,
        positionId,
        filename,
      );

      return { message: res, filename };
    } catch (err) {
      let message = 'Wystąpił nieoczekiwany błąd.';

      if (err?.response?.error) {
        message = err.response.error;
      } else if (err?.message) {
        message = err.message;
      }

      if (err instanceof InternalServerErrorException) {
        console.error('❌ Błąd bazy danych:', err.message);

        // remove saved file
        this.removeFolderContent(uploadPath);

        throw new InternalServerErrorException({
          message: 'Wystąpił problem podczas aktualizacji pozycji.',
          error: message,
          details: err,
        });
      } else {
        console.error('❌ Inny błąd:', err);
        throw new InternalServerErrorException('Wystąpił nieoczekiwany błąd.');
      }
    }
  }

  // remove folder and files inside
  removeFolderContent(folderPath: string) {
    if (fs.existsSync(folderPath)) {
      const files = fs.readdirSync(folderPath);
      files.forEach((file) => {
        const filePath = path.join(folderPath, file);
        if (fs.lstatSync(filePath).isDirectory()) {
          this.removeFolderContent(filePath);
          fs.rmdirSync(filePath);
        } else {
          fs.unlinkSync(filePath);
        }
      });
    }
  }

  removeFolder(folderPath: string) {
    if (fs.existsSync(folderPath)) {
      fs.rmdirSync(folderPath);
    }
  }
}
