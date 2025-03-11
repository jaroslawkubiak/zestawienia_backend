import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Client } from '../clients/clients.entity';
import { Setting } from '../settings/settings.entity';
import { SettingsService } from '../settings/settings.service';
import { User } from '../user/user.entity';
import { NewSetDto } from './dto/NewSet.dto';
import { Set } from './sets.entity';
import { INewSet } from './types/INewSet';
import { ISet } from './types/ISet';
import { SetStatus } from './types/SetStatus';

@Injectable()
export class SetsService {
  constructor(
    @InjectRepository(Set)
    private readonly setsRepo: Repository<Set>,
    private settingsService: SettingsService,
  ) {}

  findAll(): Promise<ISet[]> {
    return this.setsRepo
      .createQueryBuilder('set')
      .leftJoin('set.client', 'client')
      .addSelect(['client.firma', 'client.email'])
      .leftJoin('set.createdBy', 'createdBy')
      .addSelect(['createdBy.name'])
      .leftJoin('set.updatedBy', 'updatedBy')
      .addSelect(['updatedBy.name'])
      .getMany();
  }

  async create(createSet: NewSetDto): Promise<INewSet> {
    const freshSetNumber: Setting[] = await this.settingsService.getSetNumber();

    const newSet: Partial<INewSet> = {
      ...createSet,
      updatedBy: createSet.createdBy,
      hash: generateHash(),
      status: SetStatus.new,
      createDate: getFormatedDate(),
      createTimeStamp: String(Date.now()),
      updateDate: getFormatedDate(),
      updateTimeStamp: String(Date.now()),
      numer: `${String(freshSetNumber[0].value)}/${new Date().getFullYear()}`,
    };

    const createdNewSet: DeepPartial<Set> = {
      ...newSet,
      createdBy: { id: createSet.createdBy } as DeepPartial<User>,
      updatedBy: { id: createSet.createdBy } as DeepPartial<User>,
      clientId: { id: createSet.clientId } as DeepPartial<Client>,
    };

    const savedSet = await this.setsRepo.save(createdNewSet);

    if (savedSet) {
      await this.settingsService.increaseSetNumber();
    }

    return {
      numer: savedSet.numer,
      clientId: savedSet.clientId.id,
      bookmarks: savedSet.bookmarks,
      status: savedSet.status,
      createDate: savedSet.createDate,
      createTimeStamp: savedSet.createTimeStamp,
      updateDate: savedSet.updateDate,
      updateTimeStamp: savedSet.updateTimeStamp,
      hash: savedSet.hash,
      createdBy: savedSet.createdBy.id,
      updatedBy: savedSet.updatedBy.id,
    } as INewSet;
  }
}

function generateHash() {
  const length = 30;
  const characters =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let hash = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    hash += characters[randomIndex];
  }

  return hash;
}

function getFormatedDate() {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0'); // Miesiące od 0-11
  const yyyy = now.getFullYear();
  const hh = String(now.getHours()).padStart(2, '0');
  const mi = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');

  const formattedDate = `${dd}-${mm}-${yyyy} ${hh}:${mi}:${ss}`;

  return formattedDate;
}
