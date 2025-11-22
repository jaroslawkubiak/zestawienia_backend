import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import * as fs from 'fs';
import { imageSize } from 'image-size';
import { diskStorage } from 'multer';
import * as path from 'path';
import { extname } from 'path';
import { PDFDocument } from 'pdf-lib';
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
          const baseUploadPath = process.env.UPLOAD_PATH || './uploads/sets';

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

          file['absoluteUploadPath'] = uploadPath;
          file['uploadPath'] = path.join('sets', setId, directory);
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
          file['type'] = fileOriginalName[fileOriginalName.length - 1];
          file['sanitizedOriginalName'] = sanitazeName;
          file['fullFilePath'] = path.join(
            file['absoluteUploadPath'],
            sanitazeName,
          );

          cb(null, sanitazeName);
        },
      }),
    }),
  )
  async uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Nie przesłano żadnych plików');
    }
    const PT_TO_MM = 25.4 / 72; // convert point to mm in PDF

    const fileDetailsList: IFileDetails[] = await Promise.all(
      files.map(async (file) => {
        const uploadPath = file['uploadPath'];
        const relativePath = path.relative(process.cwd(), uploadPath);
        const normalizedPath = relativePath.replace(/\\/g, '/');

        const fullFilePath = file['fullFilePath'];
        let dimensions = { width: 0, height: 0 };

        try {
          const fileType = file['type'].toUpperCase();
          const fileBuffer = await fs.promises.readFile(fullFilePath);

          if (fileType === 'PDF') {
            const pdfDoc = await PDFDocument.load(fileBuffer);
            const size = pdfDoc.getPage(0).getSize();
            dimensions = {
              width: Math.floor(size.width * PT_TO_MM),
              height: Math.floor(size.height * PT_TO_MM),
            };
          } else if (['JPG', 'JPEG', 'PNG'].includes(fileType)) {
            const size = imageSize(fileBuffer);
            if (size.width && size.height) {
              dimensions = {
                width: size.width,
                height: size.height,
              };
            }
          }
        } catch (error) {
          console.warn(
            `Failed to retrieve dimensions for file ${file.filename}:`,
            error,
          );
        }

        return {
          fileName: file['sanitizedOriginalName'],
          type: file['type'],
          path: normalizedPath,
          dir: file['dir'],
          description: file['originalname'],
          setId: file['setId'],
          size: file['size'],
          width: dimensions.width,
          height: dimensions.height,
        };
      }),
    );

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

  // batch delete files from set id dir
  @Delete('')
  batchRemove(@Body() body: { ids: number[] }) {
    body.ids.forEach((id) => {
      return this.filesService.deleteFile(+id);
    });
  }

  @Post('download-zip')
  async downloadZip(@Body('ids') ids: number[], @Res() res: Response) {
    const archive = await this.filesService.downloadByIds(ids);

    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="plik.zip"',
    });

    archive.pipe(res);
  }
}
