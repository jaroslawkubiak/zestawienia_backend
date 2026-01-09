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
import { imageSize } from 'image-size';
import { diskStorage } from 'multer';
import * as path from 'path';
import { PDFDocument } from 'pdf-lib';
import { getFormatedDate } from '../helpers/getFormatedDate';
import { safeFileName } from '../helpers/safeFileName';
import { FilesService } from './files.service';
import { generateThumbnailPdf } from './generateThumbnailPdf';
import { IFileDetails } from './types/IFileDetails';
import { IFileFullDetails } from './types/IFileFullDetails';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  // save sended files to set id dir
  @Post('upload/:setId/:setHash/:dir')
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const setId = req.params.setId;
          const setHash = req.params.setHash;
          const directory = req.params.dir;
          const baseUploadPath = process.env.UPLOAD_PATH || './uploads';

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
            getFormatedDate() +
            parsed.ext.toLowerCase();

          file['sanitizedOriginalName'] = safeName;
          file['type'] = parsed.ext.replace('.', '').toUpperCase();
          file['originalNameUtf8'] = originalNameUtf8;

          cb(null, safeName);
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
        const fullFilePath = file.path;
        let dimensions = { width: 0, height: 0 };
        let thumbnailPath = '';

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

            // generate thumbnail
            const fileNameWithoutExt = path.parse(
              file['sanitizedOriginalName'],
            ).name;

            thumbnailPath = await generateThumbnailPdf(
              fullFilePath,
              fileNameWithoutExt,
            );

            thumbnailPath = path
              .relative(process.cwd(), thumbnailPath)
              .replace(/\\/g, '/');
          }

          if (['JPG', 'JPEG', 'PNG'].includes(fileType)) {
            const size = imageSize(fileBuffer);
            if (size.width && size.height) {
              dimensions = {
                width: size.width,
                height: size.height,
              };
            }
          }
        } catch (error) {
          let message = `Nie udało się przetworzyć pliku PDF "${file.originalname}". Sprawdź nazwę pliku i spróbuj ponownie.`;

          // chceck if PDF is encrypted
          if (/is encrypted/i.test(error.message)) {
            message = `Plik PDF "${file.originalname}" jest zaszyfrowany.`;
          }

          if (fullFilePath && fs.existsSync(fullFilePath)) {
            await fs.promises.unlink(fullFilePath);
          }

          throw new BadRequestException(message);
        }

        return {
          fileName: file['sanitizedOriginalName'],
          type: file['type'],
          path: path
            .relative(process.cwd(), file['absoluteUploadPath'])
            .replace(/\\/g, '/'),
          dir: file['dir'],
          originalName: file['originalNameUtf8'],
          setId: file['setId'],
          size: file['size'],
          width: dimensions.width,
          height: dimensions.height,
          thumbnail: thumbnailPath,
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
