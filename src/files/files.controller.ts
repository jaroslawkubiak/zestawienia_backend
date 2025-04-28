import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import { diskStorage } from 'multer';
import * as path from 'path';
import { extname } from 'path';
import { getFormatedDate } from '../helpers/getFormatedDate';
import { FilesService } from './files.service';
import { IFileDetails } from './types/IFileDetails';
import { IFileFullDetails } from './types/IFileFullDetails';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  // save sended files to set id dir
  @Post('upload/:setId/:dir')
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const setId = req.params.setId;
          const directory = req.params.dir;
          const baseUploadPath =
            process.env.UPLOAD_PATH || './src/uploads/sets';

          const uploadPath = path.resolve(
            baseUploadPath,
            'sets',
            setId,
            directory,
          );
          // create dir if not exists
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }

          const filePathToDB = path.resolve('sets', setId, directory);
          file['uploadPath'] = filePathToDB;
          file['setId'] = setId;
          file['dir'] = directory;

          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const fileOriginalName = file.originalname.split('.');
          const newName =
            fileOriginalName[0] +
            '-' +
            getFormatedDate() +
            extname(file.originalname);

          const sanitazeName = newName
            .trim()
            .replace(/\s+/g, '-')
            .replace(/:/g, '-')
            .replace(/[()]/g, '');
          file['type'] = fileOriginalName[1];
          file['sanitizedOriginalName'] = sanitazeName;

          cb(null, sanitazeName);
        },
      }),
    }),
  )
  async uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Nie przesłano żadnych plików');
    }

    const fileDetailsList: IFileDetails[] = files.map((file) => {
      const uploadPath = file['uploadPath'];
      const relativePath = path.relative(process.cwd(), uploadPath);
      const normalizedPath = relativePath.replace(/\\/g, '/');

      return {
        fileName: file['sanitizedOriginalName'],
        type: file['type'],
        path: normalizedPath,
        dir: file['dir'],
        description: file['originalname'],
        setId: file['setId'],
        size: file['size'],
      };
    });

    const addedFiles: IFileFullDetails[] = await Promise.all(
      fileDetailsList.map((file) => this.filesService.create(file)),
    );

    const fileCount = addedFiles.length;
    const fileWord =
      fileCount === 1 ? 'plik' : fileCount < 5 ? 'pliki' : 'plików';
    const message = `Pomyślnie przesłano ${fileCount} ${fileWord} do katalogu "${files[0]['dir']}"`;

    return {
      message,
      files: addedFiles,
      fileNames: files?.map((file) => file.filename),
    };
  }

  // delete files from set id dir
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.filesService.deleteFile(+id);
  }
}
