import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { PositionsService } from '../position/positions.service';
import * as sharp from 'sharp';
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
    positionId: number,
    file: Express.Multer.File,
  ): Promise<ISavedFiles> {
    if (!file) {
      throw new Error('Plik nie został przesłany');
    }

    const MAX_DIMENSION = 1000;
    const MINI_DIMENSION = 500;
    const innerPath = `/sets/${setId}/positions/${positionId}`;

    const basePath = (process.env.UPLOAD_PATH || 'uploads');
    const uploadPath = path.join(
      process.cwd(),
      basePath + innerPath,
    );
    
    try {
      this.removeFolderContent(uploadPath);

      fs.mkdirSync(uploadPath, { recursive: true });

      let filename = `${positionId}--${Date.now()}--${file.originalname}`;
      const filePath = path.join(uploadPath, filename);

      // save original file
      fs.writeFileSync(filePath, file.buffer);

      // if image is above MAX_DIMENSION (widht or height) scale it to mini version
      const image = sharp(file.buffer);
      const metadata = await image.metadata();

      if (metadata.width > MAX_DIMENSION || metadata.height > MAX_DIMENSION) {
        const miniBuffer = await image
          .resize({
            width: MINI_DIMENSION,
            height: MINI_DIMENSION,
            fit: 'inside',
            withoutEnlargement: true,
          })
          .toBuffer();

        // add _mini to file name
        const ext = path.extname(filename);
        const nameWithoutExt = path.basename(filename, ext);
        filename = `${nameWithoutExt}_mini${ext}`;
        const miniPath = path.join(uploadPath, filename);

        // save mini version in the same dir
        fs.writeFileSync(miniPath, miniBuffer);
      }

      //save filename (org or mini) in db
      const res = await this.positionsService.updateImage(
        userId,
        setId,
        positionId,
        filename,
      );

      return { message: res, filename };
    } catch (err) {
      const message = err.response.error;
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
