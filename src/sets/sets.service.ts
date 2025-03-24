import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { from, Observable, of, switchMap, throwError } from 'rxjs';
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
import { ISet } from './types/ISet';
import { SetStatus } from './types/SetStatus';
import { ISavedSet } from './types/ISavedSet';
import { ClientsService } from '../clients/clients.service';
import * as path from 'path';
import { ImagesService } from '../images/images.service';

@Injectable()
export class SetsService {
  constructor(
    private readonly errorsService: ErrorsService,

    @InjectRepository(Set)
    private readonly setsRepo: Repository<Set>,

    @Inject(forwardRef(() => ClientsService))
    private readonly clientsService: ClientsService,

    @Inject(forwardRef(() => ImagesService))
    private readonly imagesService: ImagesService,

    @Inject(forwardRef(() => PositionsService))
    private readonly positionsService: PositionsService,
  ) {}

  findOne(id: number): Promise<ISet> {
    return this.setsRepo
      .createQueryBuilder('set')
      .where('set.id = :id', { id: id })
      .leftJoin('set.clientId', 'client')
      .addSelect(['client.id'])
      .getOne();
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

  getSet(setId: number): Observable<ISet> {
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
    return from(query.getOne()).pipe(
      switchMap((set) =>
        set ? of(set) : throwError(() => new Error('Set not found')),
      ),
    );
  }

  async getSetsCountByClientId(clientId: number): Promise<number> {
    const query = await this.setsRepo
      .createQueryBuilder('set')
      .select('COUNT(set.id)', 'setCount')
      .where('set.clientId = :clientId', { clientId })
      .getRawOne();

    const setCount = parseInt(query.setCount, 10);

    return setCount;
  }

  async create(createSet: NewSetDto, req: Request): Promise<ISavedSet> {
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

      const response = await this.setsRepo.save(newSet);

      const savedSet: ISavedSet = {
        ...response,
        clientId: response.clientId.id,
      };

      // update clients set count
      const clientId = createSet.clientId;
      const setCount = await this.getSetsCountByClientId(clientId);
      const updateClient = {
        setCount,
      };

      this.clientsService.update(clientId, updateClient);

      return savedSet;
    } catch (error) {
      const newError: ErrorDto = {
        type: 'MySQL',
        message: 'Sets: Błąd bazy danych',
        url: req.originalUrl,
        error: JSON.stringify(error.message) || 'null',
        query: JSON.stringify(error.query) || 'null',
        parameters: error.parameters
          ? JSON.stringify(error.parameters[0])
          : 'null',
        sql: error.driverError ? JSON.stringify(error.driverError.sql) : 'null',
        createdAt: getFormatedDate() || new Date().toISOString(),
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
    const { positions, userId, positionToDelete } = updateSetDto;
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

      if (positions) {
        await this.positionsService.update(userId, positions, req);
      }

      // delete positions
      if (positionToDelete.length > 0) {
        positionToDelete.forEach((item) => {
          this.positionsService.removePosition(item);
        });
      }

      return this.findOne(id);
    } catch (error) {
      const newError: ErrorDto = {
        type: 'MySQL',
        message: 'Sets: Błąd bazy danych',
        url: req.originalUrl,
        error: JSON.stringify(error.message) || 'null',
        query: JSON.stringify(error.query) || 'null',
        parameters: error.parameters
          ? JSON.stringify(error.parameters[0])
          : 'null',
        sql: error.driverError ? JSON.stringify(error.driverError.sql) : 'null',
        createdAt: getFormatedDate() || new Date().toISOString(),
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

  async remove(id: number): Promise<void> {
    const set = await this.findOne(id);

    await this.setsRepo.delete(id);

    // update clients set count
    const clientId = set.clientId.id;
    const setCount = await this.getSetsCountByClientId(clientId);
    const updateClient = {
      setCount,
    };
    this.clientsService.update(clientId, updateClient);

    // usunac wszystkie katalogi z obrazami
    const innerPath = `/sets/${id}`;
    const uploadPath = path.join(
      process.cwd(),
      process.env.UPLOADS_PATH + innerPath || 'uploads' + innerPath,
    );

    this.imagesService.removeFolderContent(uploadPath);
    this.imagesService.removeFolder(uploadPath);
  }
}
