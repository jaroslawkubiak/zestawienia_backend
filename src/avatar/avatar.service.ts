import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { promises as fs } from 'fs';
import * as path from 'path';
import { Repository } from 'typeorm';
import { Client } from '../clients/clients.entity';
import { ErrorDto } from '../errors/dto/error.dto';
import { ErrorsService } from '../errors/errors.service';
import { IDataForLogErrors } from '../files/types/IDataForLogErrors';
import { IDeletedFileResponse } from '../files/types/IDeletedFileResponse';
import { getFormatedDate } from '../helpers/getFormatedDate';
import { Avatar } from './avatar.entity';
import { IAvatar } from './types/IAvatar';
import { IAvatarFullDetails } from './types/IAvatarFullDetails';

@Injectable()
export class AvatarService {
  baseUploadPath = process.env.UPLOAD_PATH;

  constructor(
    @InjectRepository(Avatar)
    private readonly avatarRepository: Repository<Avatar>,

    @InjectRepository(Client)
    private readonly clientRepo: Repository<Client>,

    private errorsService: ErrorsService,
  ) {}

  async findOne(id: number): Promise<IAvatar> {
    const result = await this.avatarRepository
      .createQueryBuilder('avatar')
      .where('avatar.id = :id', { id })
      .getOne();
    return result;
  }

  async removeFromDB(id: number): Promise<void> {
    await this.avatarRepository.delete(id);
  }

  async createFileEntry(file: IAvatar): Promise<IAvatarFullDetails> {
    const newFile = this.avatarRepository.create(file);

    const response = await this.avatarRepository.save(newFile);

    const mappedFile: IAvatarFullDetails = {
      id: response.id,
      fileName: response.fileName,
      type: response.type,
      path: response.path,
    };

    return mappedFile;
  }

  async getAvatars(): Promise<IAvatarFullDetails[]> {
    return this.avatarRepository
      .createQueryBuilder('avatar')
      .leftJoin(Client, 'client', 'client.avatarId = avatar.id')
      .select(['avatar.id', 'avatar.fileName', 'avatar.path'])
      .addSelect('COUNT(client.id)', 'usageCount')
      .groupBy('avatar.id')
      .addGroupBy('avatar.fileName')
      .addGroupBy('avatar.path')
      .getRawMany()
      .then((rows) =>
        rows.map((row) => ({
          id: row.avatar_id,
          fileName: row.avatar_fileName,
          path: row.avatar_path,
          type: row.avatar_type,
          canDelete:
            row.avatar_fileName !== 'default.png' &&
            Number(row.usageCount) === 0,
        })),
      );
  }

  async deleteAvatar(
    id: number,
    forLogError: IDataForLogErrors,
  ): Promise<IDeletedFileResponse> {
    const avatar = await this.findOne(id);

    const filePath = path.join(
      this.baseUploadPath,
      avatar.path,
      avatar.fileName,
    );

    // security check to prevent path travelsal attacks
    if (!filePath.startsWith(this.baseUploadPath)) {
      throw new Error('Access denied');
    }

    // check if file exists
    try {
      await fs.access(filePath);
    } catch (error) {
      const newError: ErrorDto = {
        type: 'delete file',
        message: 'Avatar: deleteAvatar()',
        url: filePath || '',
        error: JSON.stringify(error?.message) || 'null',
        query: `Plik "${avatar.fileName}" nie istnieje`,
        parameters: avatar.fileName,
        sql: `user_id=${forLogError.user_id}`,
        createdAt: getFormatedDate() || new Date().toISOString(),
        createdAtTimestamp: Number(Date.now()),
      };

      await this.errorsService.prepareError(newError);

      return {
        severity: 'error',
        message: `Plik "${avatar.fileName}" nie istnieje`,
        fileName: avatar.fileName,
      };
    }

    // try to delete file
    try {
      await fs.unlink(filePath);
      await this.removeFromDB(id);

      return {
        severity: 'success',
        message: `Plik ${avatar.fileName} został usunięty`,
        fileName: avatar.fileName,
      };
    } catch (error) {
      const newError: ErrorDto = {
        type: 'delete file',
        message: 'Avatar: deleteAvatar()',
        url: filePath || '',
        error: JSON.stringify(error?.message) || 'null',
        query: 'Błąd usuwania pliku. Plik Nie został usunięty!',
        parameters: avatar.fileName,
        sql: `user_id=${forLogError.user_id}`,
        createdAt: getFormatedDate() || new Date().toISOString(),
        createdAtTimestamp: Number(Date.now()),
      };

      await this.errorsService.prepareError(newError);

      return {
        severity: 'error',
        message: 'Błąd usuwania pliku. Plik Nie został usunięty!',
        fileName: avatar.fileName,
      };
    }
  }
}
