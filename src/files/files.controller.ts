import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import { diskStorage } from 'multer';
import * as path from 'path';
import { extname } from 'path';
import { getFormatedDate } from '../helpers/getFormatedDate';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  // save sended files to set id dir
  @Post('upload/:setId')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const setId = req.params.setId;
          const baseUploadPath =
            process.env.UPLOAD_PATH || './src/uploads/sets';
  
          const uploadPath = path.resolve(baseUploadPath, 'sets', setId, 'files');
  
          // create dir if not exists
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
  
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
          cb(null, sanitazeName);
        },
      }),
    }),
  )
  uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    return {
      message: 'Pliki zostały przesłane pomyślnie',
      fileNames: files.map((file) => file.filename),
    };
  }
  

  // Endpoint do pobierania listy plików w katalogu
  @Get('list/:setId')
  getFileList(@Param('setId') setId: string) {
    return this.filesService.getFileList(+setId);
  }
}
