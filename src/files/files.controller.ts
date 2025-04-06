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
import { IFileList } from './types/IFileList';
import { IFileToRemove } from './types/IFileToRemove';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  // save sended files to set id dir
  @Post('upload/:setId/:dir')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const setId = req.params.setId;
          const directory = req.params.dir || 'files';
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
    if (!files || files.length === 0) {
      throw new BadRequestException('Nie przesłano żadnych plików');
    }

    return {
      message: 'Pliki zostały przesłane pomyślnie',
      fileNames: files?.map((file) => file.filename),
    };
  }

  // get files list from set id dir
  @Get(':setId')
  getFileList(@Param('setId') setId: string): IFileList {
    return this.filesService.getFileList(+setId);
  }

  // delete files from set id dir
  @Delete(':setId/:path/:fileName')
  remove(
    @Param('setId') setId: string,
    @Param('path') path: string,
    @Param('fileName') fileName: string,
  ) {
    const fileToRemove: IFileToRemove = {
      setId,
      fileName,
      path,
    };
    return this.filesService.deleteFile(fileToRemove);
  }
}
