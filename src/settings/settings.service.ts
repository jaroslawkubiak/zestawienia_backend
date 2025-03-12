import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from './settings.entity';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Setting)
    private readonly settingsRepo: Repository<Setting>,
  ) {}

  findAll(): Promise<Setting[]> {
    return this.settingsRepo.find();
  }

  getByType(type: string): Promise<Setting> {
    return this.settingsRepo.findOneBy({ type });
  }
}
