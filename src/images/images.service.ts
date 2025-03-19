import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { PositionsService } from '../position/positions.service';

@Injectable()
export class ImagesService {
  constructor(private positionService: PositionsService) {}
  async saveImage(
    userId: number,
    setId: number,
    positionId: number,
    file: Express.Multer.File,
  ): Promise<any> {
    if (!file) {
      throw new Error('Plik nie został przesłany');
    }

    const innerPath = `/${setId}/${positionId}`;

    const uploadPath = path.join(
      process.cwd(),
      process.env.UPLOADS_PATH + innerPath || 'uploads' + innerPath,
    );
    // const uploadPath = path.join(__dirname, '..', 'uploads'); // to zapisuje pliki w katalogu /dist

    try {
      removeFolderContent(uploadPath);

      fs.mkdirSync(uploadPath, { recursive: true });

      const filename = `${positionId}--${Date.now()}--${file.originalname}`;
      const filePath = path.join(uploadPath, filename);

      fs.writeFileSync(filePath, file.buffer);

      const res = await this.positionService.updateImage(
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
        removeFolderContent(uploadPath);

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
}

// remove folder and files inside
const removeFolderContent = (folderPath: string) => {
  if (fs.existsSync(folderPath)) {
    const files = fs.readdirSync(folderPath);
    files.forEach((file) => {
      const filePath = path.join(folderPath, file);
      if (fs.lstatSync(filePath).isDirectory()) {
        removeFolderContent(filePath);
        fs.rmdirSync(filePath);
      } else {
        fs.unlinkSync(filePath);
      }
    });
  }
};
