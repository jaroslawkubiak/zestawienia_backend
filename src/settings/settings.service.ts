import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { In, Repository } from 'typeorm';
import { ErrorDto } from '../errors/dto/error.dto';
import { ErrorsService } from '../errors/errors.service';
import { ErrorsType } from '../errors/types/Errors';
import { getFormatedDate } from '../helpers/getFormatedDate';
import { Setting } from './settings.entity';
import { DbSettings } from './types/IDbSettings';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Setting)
    private readonly settingsRepo: Repository<Setting>,
    private errorsService: ErrorsService,
  ) {}

  findAll(): Promise<DbSettings[]> {
    return this.settingsRepo.find();
  }

  getSettingByName(name: string): Promise<DbSettings> {
    return this.settingsRepo.findOneBy({ name });
  }

  async getSettingsByNames(names: string[]): Promise<DbSettings[]> {
    const settings = await this.settingsRepo.find({
      where: {
        name: In(names),
      },
    });

    return settings.map((setting) => ({
      id: setting.id,
      name: setting.name,
      value: setting.value,
      type: setting.type,
    }));
  }

  async saveSettings(
    settings: DbSettings[],
    req?: Request,
  ): Promise<{ message: string }> {
    try {
      for (const setting of settings) {
        await this.settingsRepo.update(
          { id: setting.id },
          { value: setting.value },
        );
      }

      return { message: 'Ustawienia zapisane poprawnie' };
    } catch (err) {
      const newError: ErrorDto = {
        type: ErrorsType.sql,
        message: 'Settings: saveSettings()',
        url: req.originalUrl,
        error: JSON.stringify(err?.message) || 'null',
        query: JSON.stringify(err?.query) || 'null',
        parameters: JSON.stringify(err?.parameters?.[0]) || 'null',
        sql: JSON.stringify(err?.driverError?.sql) || 'null',
        createdAt: getFormatedDate() || new Date().toISOString(),
        createdAtTimestamp: Number(Date.now()),
      };

      await this.errorsService.prepareError(newError);

      throw new InternalServerErrorException({
        message: 'Błąd bazy danych',
        error: err.message,
        details: err,
      });
    }
  }
}
