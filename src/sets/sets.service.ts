import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable, from } from 'rxjs';
import { DeepPartial, Repository } from 'typeorm';
import { Client } from '../clients/clients.entity';
import { generateHash } from '../helpers/generateHash';
import { getFormatedDate } from '../helpers/getFormatedDate';
import { Position } from '../position/positions.entity';
import { User } from '../user/user.entity';
import { NewSetDto } from './dto/NewSet.dto';
import { Set } from './sets.entity';
import { INewSet } from './types/INewSet';
import { IPosition } from './types/IPosition';
import { ISet } from './types/ISet';
import { SetStatus } from './types/SetStatus';

@Injectable()
export class SetsService {
  constructor(
    @InjectRepository(Set)
    private readonly setsRepo: Repository<Set>,
    @InjectRepository(Position)
    private readonly positionsRepo: Repository<Position>,
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
    const query = this.setsRepo
      .createQueryBuilder('set')
      .where('set.id = :id', { id: setId })
      .leftJoin('set.clientId', 'client')
      .addSelect(['client.id', 'client.firma', 'client.email'])
      .leftJoin('set.createdBy', 'createdBy')
      .addSelect(['createdBy.id','createdBy.name'])
      .leftJoin('set.updatedBy', 'updatedBy')
      .addSelect(['updatedBy.id', 'updatedBy.name']);

    // console.log(query.getQuery());
    return from(query.getMany());
  }

  getPositions(setId: number): Observable<IPosition[]> {
    const query = this.positionsRepo
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
      .addSelect(['updatedBy.id', 'updatedBy.name']);

    // console.log(query.getQuery());
    return from(query.getMany());
  }

  async create(createSet: NewSetDto): Promise<INewSet> {
    const newSet: DeepPartial<Set> = {
      ...createSet,
      createdBy: { id: createSet.createdBy } as DeepPartial<User>,
      updatedBy: { id: createSet.createdBy } as DeepPartial<User>,
      clientId: { id: createSet.clientId } as DeepPartial<Client>,
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
      createdBy: savedSet.createdBy,
      updatedBy: savedSet.updatedBy,
    };
  }
}
