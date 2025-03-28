import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { PositionsService } from '../position/positions.service';

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
  ): Promise<any> {
    if (!file) {
      throw new Error('Plik nie został przesłany');
    }

    const innerPath = `/sets/${setId}/${positionId}`;

    const uploadPath = path.join(
      process.cwd(),
      process.env.UPLOAD_PATH + innerPath || 'uploads' + innerPath,
    );
    // const uploadPath = path.join(__dirname, '..', 'uploads'); // to zapisuje pliki w katalogu /dist

    try {
      this.removeFolderContent(uploadPath);

      fs.mkdirSync(uploadPath, { recursive: true });

      const filename = `${positionId}--${Date.now()}--${file.originalname}`;
      const filePath = path.join(uploadPath, filename);

      fs.writeFileSync(filePath, file.buffer);

      const res = await this.positionsService.updateImage(
        userId,
        setId,
        positionId,
        filename,
      );

      return { message: res, filename };
    } catch (error) {
      const message = error.response.error;
      if (error instanceof InternalServerErrorException) {
        console.error('❌ Błąd bazy danych:', error.message);

        // remove saved file
        this.removeFolderContent(uploadPath);

        throw new InternalServerErrorException({
          message: 'Wystąpił problem podczas aktualizacji pozycji.',
          error: message,
          details: error,
        });
      } else {
        console.error('❌ Inny błąd:', error);
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
