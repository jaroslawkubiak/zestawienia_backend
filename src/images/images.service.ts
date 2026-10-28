import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as fs from 'fs';
import { randomUUID } from 'node:crypto';
import * as path from 'path';
import { IProcessFile } from '../files/types/IProcessFile';
import { createImageThumbnail } from '../helpers/createImageThumbnail';
import { PositionLogsService } from '../position-logs/position-logs.service';
import { PositionsService } from '../position/positions.service';
import { ISavedFiles } from './types/ISavedFiles';

@Injectable()
export class ImagesService {
  constructor(
    @Inject(forwardRef(() => PositionsService))
    private readonly positionsService: PositionsService,
    private readonly positionLogsService: PositionLogsService,
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
    let filename = file.originalname;

    // store position image logs
    const uploadId = randomUUID();
    await this.positionLogsService.createEntry({
      uploadId,
      event: 'started',
      userId,
      setId,
      positionId,
      image: filename,
    });

    const innerPath = `/sets/${setId}/${setHash}/positions/${positionId}`;

    const basePath = process.env.UPLOAD_PATH || 'uploads';
    const uploadPath = path.join(process.cwd(), basePath + innerPath);

    try {
      this.removeFolderContent(uploadPath);

      fs.mkdirSync(uploadPath, { recursive: true });

      filename = `${positionId}--${Date.now()}--${file.originalname}`;
      const filePath = path.join(uploadPath, filename);
      // save original file
      fs.writeFileSync(filePath, file.buffer);

      // store position image logs
      await this.positionLogsService.createEntry({
        uploadId,
        event: 'file_saved',
        userId,
        setId,
        positionId,
        image: filename,
        details: {
          size: file.size,
          mimetype: file.mimetype,
        },
      });

      // generating thumbnail
      const processFile: IProcessFile = await createImageThumbnail(
        file,
        filename,
        uploadPath,
      );

      // store position image logs
      await this.positionLogsService.createEntry({
        uploadId,
        event: 'thumbnail_created',
        userId,
        setId,
        positionId,
        image: filename,
        details: {
          thumbnailFileName: processFile.thumbnailFileName,
        },
      });

      // store position image logs
      await this.positionLogsService.createEntry({
        uploadId,
        event: 'db_update_started',
        userId,
        setId,
        positionId,
        image: filename,
      });

      // save filename (org or mini) in db
      const res = await this.positionsService.updateImage(
        userId,
        setId,
        setHash,
        positionId,
        filename,
        processFile.thumbnailFileName,
        uploadId,
      );

      // store position image logs
      await this.positionLogsService.createEntry({
        uploadId,
        event: 'completed',
        userId,
        setId,
        positionId,
        image: filename,
      });

      return { message: res, filename };
    } catch (err: any) {
      let message = 'Wystąpił nieoczekiwany błąd.';

      if (err?.response?.error) {
        message = err.response.error;
      } else if (err?.message) {
        message = err.message;
      }

      const errorMessage = err instanceof Error ? err.message : String(err);

      await this.positionLogsService.createEntry({
        uploadId,
        event: 'failed',
        userId,
        setId,
        positionId,
        logs: errorMessage,
        details: {
          stage: 'saveImage',
          error: errorMessage,
          stack: err instanceof Error ? err.stack : undefined,
        },
      });

      if (err instanceof InternalServerErrorException) {
        console.error('❌ Błąd bazy danych:', err.message);

        // remove saved file
        this.removeFolderContent(uploadPath);

        const errorLog = {
          message: 'Wystąpił problem podczas aktualizacji pozycji.',
          error: message,
          details: err,
        };

        throw new InternalServerErrorException(errorLog);
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
