import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as iconv from 'iconv-lite';
import { diskStorage } from 'multer';
import * as path from 'path';
import { ErrorDto } from '../errors/dto/error.dto';
import { ErrorsService } from '../errors/errors.service';
import { IDataForLogErrors } from '../files/types/IDataForLogErrors';
import { IDeletedFileResponse } from '../files/types/IDeletedFileResponse';
import { IFileUploadResponse } from '../files/types/IFileUploadResponse';
import { IProcessFile } from '../files/types/IProcessFile';
import { convertHeicToJpg } from '../helpers/convertHeicToJpg';
import { createImageThumbnail } from '../helpers/createImageThumbnail';
import { getFormatedDate } from '../helpers/getFormatedDate';
import { getFormatedDateForFileName } from '../helpers/getFormatedDateForFileName';
import { safeFileName } from '../helpers/safeFileName';
import { AvatarService } from './avatar.service';
import { IAvatar } from './types/IAvatar';
import { IAvatarFullDetails } from './types/IAvatarFullDetails';

@Controller('avatar')
export class AvatarController {
  constructor(
    private readonly avatarService: AvatarService,
    private errorsService: ErrorsService,
  ) {}

  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('files', 30, {
      storage: diskStorage({
        destination: async (req, file, cb) => {
          const clientId = req.body.clientId;
          const isClientsAvatar = !!clientId;

          const baseUploadPath = process.env.UPLOAD_PATH;

          //relative path on server
          let relativePath = path.join('avatars');

          if (isClientsAvatar) {
            relativePath = path.join('avatars', 'clients', clientId);
          }

          const absolutePath = path.resolve(baseUploadPath, relativePath);

          // remove old files in directory
          if (isClientsAvatar && fs.existsSync(absolutePath)) {
            await fs.promises.rm(absolutePath, {
              recursive: true,
              force: true,
            });
          }

          // create dir if not exists
          fs.mkdirSync(absolutePath, { recursive: true });

          file['absoluteUploadPath'] = absolutePath;
          file['uploadPath'] = relativePath;

          cb(null, absolutePath);
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
  async uploadAvatarFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('clientId') clientId?: number,
  ): Promise<IFileUploadResponse> {
    if (!files || files.length === 0) {
      throw new BadRequestException('Nie przesłano żadnych plików');
    }

    const isAvatar = true;

    const fileDetailsList = await Promise.all(
      files.map(async (file) => {
        let fileDetails: IProcessFile = {
          dimensions: { width: 0, height: 0 },
          thumbnailFileName: '',
        };

        try {
          if (file['type'] === 'HEIC') {
            const converted = await convertHeicToJpg(file);

            file.path = converted.path;
            file.filename = converted.filename;
            file['sanitizedOriginalName'] = converted.newSanitizedName;
            file['type'] = converted.type;
          }

          if (['JPG', 'JPEG', 'PNG'].includes(file['type'])) {
            fileDetails = await createImageThumbnail(
              file,
              file['sanitizedOriginalName'],
              file['absoluteUploadPath'],
              isAvatar,
            );
          }
        } catch (error: any) {
          let message = `Nie udało się przetworzyć pliku "${file.originalname}" \nSprawdź nazwę pliku i spróbuj ponownie.`;

          const newError: ErrorDto = {
            type: 'upload file',
            message: 'Avatar: uploadAvatarFiles()',
            url: file.path || '',
            error: JSON.stringify(error?.message) || 'null',
            query: message,
            parameters: file.filename,
            sql: '',
            createdAt: getFormatedDate() || new Date().toISOString(),
            createdAtTimestamp: Number(Date.now()),
          };

          await this.errorsService.prepareError(newError);

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
          clientId,
        };
      }),
    );

    const addedFiles: IAvatar[] = await Promise.all(
      fileDetailsList.map((file) => this.avatarService.createFileEntry(file)),
    );

    return {
      filesCount: files.length,
      dir: 'avatars',
      files: addedFiles,
      fileNames: files?.map((file) => file.filename),
    };
  }

  @Get('getAvatars')
  async getAvatars(
    @Query('clientId') clientId?: string,
  ): Promise<IAvatarFullDetails[]> {
    const parsedClientId = clientId ? Number(clientId) : null;

    return this.avatarService.getAvatars(parsedClientId);
  }

  @Patch(':clientId/:avatarId/setAvatar')
  updateLastActiveUserBookmark(
    @Param('clientId') clientId: string,
    @Param('avatarId') avatarId: string,
  ): Promise<IAvatar> {
    return this.avatarService.setAvatar(+clientId, +avatarId);
  }

  @Delete(':id/deleteAvatar')
  deleteAvatar(
    @Param('id') id: number,
    @Headers('x-user-id') user_id: string,
  ): Promise<IDeletedFileResponse> {
    const forLogError: IDataForLogErrors = { user_id, set_id: '' };
    return this.avatarService.deleteAvatar(id, forLogError);
  }
}
