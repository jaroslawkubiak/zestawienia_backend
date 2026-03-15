import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { promises as fs } from 'fs';
import * as path from 'path';
import { Brackets, Repository } from 'typeorm';
import { Client } from '../clients/clients.entity';
import { ClientsService } from '../clients/clients.service';
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

    private clientsService: ClientsService,
  ) {}

  async findOne(id: number): Promise<IAvatar> {
    const result = await this.avatarRepository
      .createQueryBuilder('avatar')
      .where('avatar.id = :id', { id })
      .getOne();
    return result;
  }

  async findByClientId(clientId: number): Promise<Avatar> {
    const result = await this.avatarRepository
      .createQueryBuilder('avatar')
      .where('avatar.clientId = :clientId', { clientId })
      .getOne();
    return result;
  }

  async removeFromDB(id: number): Promise<void> {
    await this.avatarRepository.delete(id);
  }

  async createFileEntry(file: IAvatar): Promise<IAvatarFullDetails> {
    // if client is sending avatar - they have limit to one avatar file, so we have to remove previuos one
    const clientId = file.clientId;
    let clientName = '';
    if (clientId) {
      const clientEntry = await this.clientRepo.findOne({
        where: { id: clientId },
      });

      if (clientEntry) {
        clientName = clientEntry.firstName + ' ' + clientEntry.lastName;
      }

      const clientDBEntry = await this.findByClientId(clientId);
      const client = await this.clientsService.findOneClient(clientId);
      // if client have avatar - delete it
      if (clientDBEntry) {
        if (clientDBEntry.id === client.avatar.id) {
          await this.setAvatar(clientId, 1);
        }

        await this.removeFromDB(clientDBEntry.id);
      }
    }

    const newFile = this.avatarRepository.create({
      fileName: file.fileName,
      type: file.type,
      path: file.path,
      client: clientId ? { id: Number(clientId) } : null,
    });
    const response = await this.avatarRepository.save(newFile);

    const mappedFile: IAvatarFullDetails = {
      id: response.id,
      fileName: response.fileName,
      type: response.type,
      path: response.path,
      clientName,
    };

    return mappedFile;
  }

  async getAvatars(clientId: number | null): Promise<IAvatarFullDetails[]> {
    const qb = this.avatarRepository
      .createQueryBuilder('avatar')
      .leftJoinAndSelect('avatar.client', 'client')
      .addSelect((subQuery) => {
        return subQuery
          .select('COUNT(c.id)')
          .from(Client, 'c')
          .where('c.avatarId = avatar.id');
      }, 'usageCount');

    if (clientId !== null) {
      qb.andWhere(
        new Brackets((qb) => {
          qb.where('avatar.clientId IS NULL').orWhere(
            'avatar.clientId = :clientId',
            { clientId },
          );
        }),
      );
    }

    const rows = await qb.getRawMany();

    return rows.map((row) => ({
      id: row.avatar_id,
      fileName: row.avatar_fileName,
      path: row.avatar_path,
      type: row.avatar_type,
      clientName: row.client_id
        ? row.client_firstName + ' ' + row.client_lastName
        : null,
      usageCount: Number(row.usageCount) ?? 0,
    }));
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

  async setAvatar(clientId: number, avatarId: number): Promise<IAvatar> {
    await this.clientsService.updateClientAvatar(clientId, avatarId);

    return this.findOne(avatarId);
  }
}
