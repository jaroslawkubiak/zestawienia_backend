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
import { generateHash } from '../helpers/generateHash';
import { getFormatedDate } from '../helpers/getFormatedDate';

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
      .getMany();
  }
  //.orderBy('set.id', 'DESC')

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
        .where('position.setId = :id', { id: setId })
        .leftJoin('position.bookmarkId', 'bookmark')
        .addSelect(['bookmark.name', 'bookmark.id'])
        .leftJoin('position.supplierId', 'supplier')
        .addSelect([
          'supplier.id',
          'supplier.firma',
          'supplier.imie',
          'supplier.nazwisko',
        ])
        .leftJoin('position.createdBy', 'createdBy')
        .addSelect(['createdBy.id', 'createdBy.name'])
        .leftJoin('position.updatedBy', 'updatedBy')
        .addSelect(['updatedBy.id', 'updatedBy.name'])
        .getMany(),
    );
  }

  async create(createSet: NewSetDto): Promise<any> {
    const newSet: DeepPartial<Set> = {
      createdBy: { id: createSet.createdBy } as DeepPartial<User>,
      updatedBy: { id: createSet.createdBy } as DeepPartial<User>,
      clientId: { id: createSet.clientId } as DeepPartial<Client>,
      bookmarks: createSet.bookmarks,
      hash: generateHash(),
      status: SetStatus.new,
      createdAt: getFormatedDate(),
      createdAtTimestamp: Number(Date.now()),
      updatedAt: getFormatedDate(),
      updatedAtTimestamp: Number(Date.now()),
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
