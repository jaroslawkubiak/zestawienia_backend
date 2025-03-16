import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Observable, from } from 'rxjs';
import { DeepPartial, Repository } from 'typeorm';
import { Client } from '../clients/clients.entity';
import { ErrorDto } from '../errors/dto/error.dto';
import { ErrorsService } from '../errors/errors.service';
import { generateHash } from '../helpers/generateHash';
import { getFormatedDate } from '../helpers/getFormatedDate';
import { PositionsService } from '../position/positions.service';
import { User } from '../user/user.entity';
import { NewSetDto } from './dto/NewSet.dto';
import { UpdateSetAndPositionDto } from './dto/updateSetAndPosition.dto';
import { Set } from './sets.entity';
import { INewSet } from './types/INewSet';
import { ISet } from './types/ISet';
import { SetStatus } from './types/SetStatus';

@Injectable()
export class SetsService {
  constructor(
    @InjectRepository(Set)
    private readonly setsRepo: Repository<Set>,
    private readonly errorsService: ErrorsService,
    private readonly positionsService: PositionsService,
  ) {}

  findOne(id: number): Promise<ISet> {
    return this.setsRepo.findOneBy({ id });
  }

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
      .addSelect(['createdBy.id', 'createdBy.name'])
      .leftJoin('set.updatedBy', 'updatedBy')
      .addSelect(['updatedBy.id', 'updatedBy.name']);

    // console.log(query.getQuery());
    return from(query.getMany());
  }

  async create(createSet: NewSetDto, req: Request): Promise<INewSet> {
    try {
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
    } catch (error) {
      const newError: ErrorDto = {
        type: 'MySQL',
        message: 'Błąd bazy danych',
        url: req.originalUrl,
        error: error.message,
        query: error.query || null,
        parameters: error.parameters[0] || null,
        sql: error.driverError.sql || null,
        createdAt: getFormatedDate(),
        createdAtTimestamp: Number(Date.now()),
      };

      await this.errorsService.prepareError(newError);

      throw new InternalServerErrorException({
        message: 'Błąd bazy danych',
        error: error.message,
        details: error,
      });
    }
  }

  async update(
    id: number,
    updateSetDto: UpdateSetAndPositionDto,
    req: Request,
  ): Promise<any> {
    const { positions, userId } = updateSetDto;

    try {
      const savedSet = {
        ...updateSetDto.set,
        updatedBy: { id: userId } as DeepPartial<User>,
        updatedAt: getFormatedDate(),
        updatedAtTimestamp: Number(Date.now()),
      };
      const updateSetResult = await this.setsRepo.update(id, savedSet);

      if (updateSetResult?.affected === 0) {
        throw new NotFoundException(`Set with ID ${id} not found`);
      }

      await this.positionsService.update(userId, positions, req);

      return this.findOne(id);
    } catch (error) {
      const newError: ErrorDto = {
        type: 'MySQL',
        message: 'Błąd bazy danych',
        url: req.originalUrl,
        error: error.message,
        query: error.query || '',
        parameters: error.parameters ? error.parameters[0] : '',
        sql: error.driverError ? error.driverError.sql : '',
        createdAt: getFormatedDate(),
        createdAtTimestamp: Number(Date.now()),
      };

      await this.errorsService.prepareError(newError);

      throw new InternalServerErrorException({
        message: 'Błąd bazy danych',
        error: error.message,
        details: error,
      });
    }
  }
}
