import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Client } from '../clients/clients.entity';
import { Position } from '../position/positions.entity';
import { Setting } from '../settings/settings.entity';
import { SettingsService } from '../settings/settings.service';
import { User } from '../user/user.entity';
import { NewSetDto } from './dto/NewSet.dto';
import { Set } from './sets.entity';
import { INewSet } from './types/INewSet';
import { IPosition } from './types/IPosition';
import { ISet } from './types/ISet';
import { SetStatus } from './types/SetStatus';
import { Observable, from } from 'rxjs';

@Injectable()
export class SetsService {
  constructor(
    @InjectRepository(Set)
    private readonly setsRepo: Repository<Set>,
    @InjectRepository(Position)
    private readonly positionsRepo: Repository<Position>,
    private settingsService: SettingsService,
  ) {}

  findAll(): Promise<ISet[]> {
    return this.setsRepo
      .createQueryBuilder('set')
      .leftJoin('set.clientId', 'client')
      .addSelect(['client.firma', 'client.email'])
      .leftJoin('set.createdBy', 'createdBy')
      .addSelect(['createdBy.name'])
      .leftJoin('set.updatedBy', 'updatedBy')
      .addSelect(['updatedBy.name'])
      .orderBy('set.id', 'DESC')
      .getMany();
  }

  getSet(setId: number): Observable<ISet[]> {
    return from(
      this.setsRepo
        .createQueryBuilder('set')
        .where('set.id = :id', { id: setId })
        .leftJoin('set.clientId', 'client')
        .addSelect(['client.firma', 'client.email'])
        .getMany(),
    );
  }

  getPositions(setId: number): Observable<IPosition[]> {
    return from(
      this.positionsRepo
        .createQueryBuilder('position')
        .where('position.set = :id', { id: setId })
        .getMany(),
    );
  }

  async create(createSet: NewSetDto): Promise<any> {
    const freshSetNumber: Setting[] = await this.settingsService.getSetNumber();

    const newSet: DeepPartial<Set> = {
      name: `${String(freshSetNumber[0].value)}/${new Date().getFullYear()}`,
      createdBy: { id: createSet.createdBy } as DeepPartial<User>,
      updatedBy: { id: createSet.createdBy } as DeepPartial<User>,
      clientId: { id: createSet.clientId } as DeepPartial<Client>,
      bookmarks: createSet.bookmarks,
      hash: generateHash(),
      status: SetStatus.new,
      createdAt: getFormatedDate(),
      createdAtTimestamp: Date.now(),
      updatedAt: getFormatedDate(),
      updatedAtTimestamp: Date.now(),
    };

    const savedSet = await this.setsRepo.save(newSet);

    return {
      ...savedSet,
      clientId: savedSet.clientId.id,
      createdBy: savedSet.createdBy.id,
      updatedBy: savedSet.updatedBy.id,
    };
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
