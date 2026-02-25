import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Res,
  StreamableFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import * as fs from 'fs';
import * as iconv from 'iconv-lite';
import { diskStorage } from 'multer';
import * as path from 'path';
import { convertHeicToJpg } from 'src/helpers/convertHeicToJpg';
import { createImageThumbnail } from '../helpers/createImageThumbnail';
import { getFormatedDateForFileName } from '../helpers/getFormatedDateForFileName';
import { safeFileName } from '../helpers/safeFileName';
import { FilesService } from './files.service';
import { IDeletedFileResponse } from './types/IDeletedFileResponse';
import { IFileDetails } from './types/IFileDetails';
import { IFileFullDetails } from './types/IFileFullDetails';
import { IProcessFile } from './types/IProcessFile';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  // save sended files to set id dir
  @Post('upload/:setId/:setHash/:dir')
  @UseInterceptors(
    FilesInterceptor('files', 30, {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const setId = req.params.setId;
          const setHash = req.params.setHash;
          const directory = req.params.dir;
          const baseUploadPath = process.env.UPLOAD_PATH;

          const uploadPath = path.resolve(
            baseUploadPath,
            'sets',
            setId,
            setHash,
            directory,
          );

          // create dir if not exists
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }

          file['absoluteUploadPath'] = uploadPath;
          file['uploadPath'] = path.join('sets', setId, setHash, directory);
          file['setId'] = setId;
          file['dir'] = directory;

          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const originalNameUtf8 = iconv.decode(
            Buffer.from(file.originalname, 'binary'),
            'utf8',
          );
          const parsed = path.parse(originalNameUtf8);
          const safeName =
            safeFileName(parsed.name) +
            '-' +
            getFormatedDateForFileName() +
            parsed.ext.toLowerCase();

          file['sanitizedOriginalName'] = safeName;
          file['originalNameUtf8'] = originalNameUtf8;
          file['type'] = parsed.ext.replace('.', '').toUpperCase();

          cb(null, safeName);
        },
      }),
    }),
  )
  async uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Nie przesłano żadnych plików');
    }

    const fileDetailsList: IFileDetails[] = await Promise.all(
      files.map(async (file) => {
        let fileDetails: IProcessFile = {
          dimensions: { width: 0, height: 0 },
          thumbnailFileName: '',
        };
        file['type'] = file['type'].toUpperCase();

        try {
          if (file['type'] === 'HEIC') {
            const converted = await convertHeicToJpg(file);

            file.path = converted.path;
            file.filename = converted.filename;
            file['sanitizedOriginalName'] = converted.newSanitizedName;
            file['type'] = converted.type;
          }

          if (file['type'] === 'PDF') {
            const fileBuffer = await fs.promises.readFile(file.path);
            fileDetails = await this.filesService.processPdf(fileBuffer, file);
          }

          if (['JPG', 'JPEG', 'PNG'].includes(file['type'])) {
            fileDetails = await createImageThumbnail(
              file,
              file['sanitizedOriginalName'],
              file['absoluteUploadPath'],
            );
          }
        } catch (error) {
          //TODO log error in DB
          let message = `Nie udało się przetworzyć pliku "${file.originalname}" \nSprawdź nazwę pliku i spróbuj ponownie.`;

          // chceck if PDF is encrypted
          if (/is encrypted/i.test(error.message)) {
            message = `Plik PDF "${file.originalname}" jest zaszyfrowany.`;
          }

          if (file.path && fs.existsSync(file.path)) {
            await fs.promises.unlink(file.path);
          }

          throw new BadRequestException(message);
        }

        return {
          fileName: file['sanitizedOriginalName'],
          type: file['type'],
          path: path
            .relative(process.cwd(), file['uploadPath'])
            .replace(/\\/g, '/'),
          dir: file['dir'],
          originalName: file['originalNameUtf8'],
          setId: file['setId'],
          size: file['size'],
          width: fileDetails.dimensions.width,
          height: fileDetails.dimensions.height,
          thumbnail: fileDetails.thumbnailFileName,
        };
      }),
    );

    const addedFiles: IFileFullDetails[] = await Promise.all(
      fileDetailsList.map((file) => this.filesService.createFileEntry(file)),
    );

    const returnMessage = this.filesService.returnUploadMessage(
      addedFiles.length,
      files[0]['dir'],
    );

    return {
      message: returnMessage,
      files: addedFiles,
      fileNames: files?.map((file) => file.filename),
    };
  }

  // delete files from set id dir
  @Delete(':id/deleteFile')
  deleteFile(@Param('id') id: string): Promise<IDeletedFileResponse> {
    return this.filesService.deleteFile(+id);
  }

  // batch delete files from set id dir
  @Delete('/deleteSomeFiles')
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

  //download one file
  @Get('download/:setId/:fileId')
  async downloadSingleFile(
    @Param('setId') setId: string,
    @Param('fileId') fileId: string,
  ) {
    const fileDetails = await this.filesService.findOneFileInSet(
      +setId,
      +fileId,
    );

    if (!fileDetails) {
      throw new NotFoundException('Plik nie istnieje lub został usunięty');
    }

    const fileName = fileDetails.fileName;
    const basePath = process.env.UPLOAD_PATH;
    const filePath = path.join(basePath, fileDetails.path, fileName);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException(
        'Plik jest chwilowo niedostępny. Spróbuj ponownie później.',
      );
    }

    const fileStream = fs.createReadStream(filePath);

    return new StreamableFile(fileStream, {
      type: 'application/octet-stream',
      disposition: `attachment; filename="${fileName}"`,
    });
  }
}
