import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import * as path from 'path';
import {
  forkJoin,
  from,
  map,
  mergeMap,
  Observable,
  of,
  switchMap,
  throwError,
} from 'rxjs';
import { Supplier } from '../suppliers/suppliers.entity';
import { DeepPartial, Repository } from 'typeorm';
import { Client } from '../clients/clients.entity';
import { ClientsService } from '../clients/clients.service';
import { CommentsService } from '../comments/comments.service';
import { IComment } from '../comments/types/IComment';
import { ErrorDto } from '../errors/dto/error.dto';
import { ErrorsService } from '../errors/errors.service';
import { ErrorsType } from '../errors/types/Errors';
import { FilesService } from '../files/files.service';
import { generateHash } from '../helpers/generateHash';
import { getFormatedDate } from '../helpers/getFormatedDate';
import { ImagesService } from '../images/images.service';
import { PositionsService } from '../position/positions.service';
import { User } from '../user/user.entity';
import { NewSetDto } from './dto/NewSet.dto';
import { UpdateSetAndPositionDto } from './dto/updateSetAndPosition.dto';
import { Set } from './sets.entity';
import { ISavedSet } from './types/ISavedSet';
import { ISet } from './types/ISet';
import { SetStatus } from './types/SetStatus';

@Injectable()
export class SetsService {
  constructor(
    private readonly errorsService: ErrorsService,

    @InjectRepository(Set)
    private readonly setsRepo: Repository<Set>,
    @InjectRepository(Supplier)
    private readonly supplierRepo: Repository<Supplier>,

    @Inject(forwardRef(() => ClientsService))
    private readonly clientsService: ClientsService,

    @Inject(forwardRef(() => ImagesService))
    private readonly imagesService: ImagesService,

    @Inject(forwardRef(() => PositionsService))
    private readonly positionsService: PositionsService,

    @Inject(forwardRef(() => CommentsService))
    private readonly commentsService: CommentsService,
    @Inject(forwardRef(() => FilesService))
    private readonly filesService: FilesService,
  ) {}

  findOne(id: number): Promise<ISet> {
    return this.setsRepo
      .createQueryBuilder('set')
      .where('set.id = :id', { id: id })
      .leftJoin('set.clientId', 'client')
      .addSelect([
        'client.id',
        'client.firstName',
        'client.lastName',
        'client.company',
      ])
      .getOne();
  }

  async findAll(): Promise<ISet[]> {
    const sets = await this.setsRepo
      .createQueryBuilder('set')
      .leftJoin('set.clientId', 'client')
      .addSelect([
        'client.email',
        'client.lastName',
        'client.firstName',
        'client.company',
      ])
      .leftJoin('set.createdBy', 'createdBy')
      .addSelect(['createdBy.name'])
      .leftJoin('set.updatedBy', 'updatedBy')
      .addSelect(['updatedBy.name'])
      .leftJoinAndSelect('set.comments', 'comments')
      .leftJoinAndSelect('set.files', 'files')
      .leftJoin('files.setId', 'fileSet')
      .addSelect(['fileSet.id'])
      .getMany();

    // sort set files from newest to oldest
    sets.forEach((set) => {
      set.files.sort((a, b) => b.createdAtTimestamp - a.createdAtTimestamp);
    });

    return sets;
  }

  getSet(setId: number): Observable<ISet> {
    return from(
      this.setsRepo
        .createQueryBuilder('set')
        .where('set.id = :id', { id: setId })
        .leftJoin('set.clientId', 'client')
        .addSelect([
          'client.id',
          'client.company',
          'client.email',
          'client.firstName',
          'client.lastName',
        ])
        .leftJoin('set.createdBy', 'createdBy')
        .addSelect(['createdBy.id', 'createdBy.name'])
        .leftJoin('set.updatedBy', 'updatedBy')
        .addSelect(['updatedBy.id', 'updatedBy.name'])
        .leftJoinAndSelect('set.files', 'files')
        .leftJoin('files.setId', 'fileSet')
        .addSelect(['fileSet.id'])
        .getOne(),
    ).pipe(
      mergeMap((set) => {
        if (!set) {
          return throwError(() => new Error('Set not found'));
        }

        // sort set files from newest to oldest
        if (Array.isArray(set.files) && set.files.length > 0) {
          set.files.sort((a, b) => b.createdAtTimestamp - a.createdAtTimestamp);
        }

        return from(this.commentsService.findBySetId(setId)).pipe(
          switchMap((comments: IComment[]) => of({ ...set, comments })),
        );
      }),
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
    } catch (err) {
      const newError: ErrorDto = {
        type: ErrorsType.sql,
        message: 'Set: create()',
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
      if (positionToDelete?.length > 0) {
        positionToDelete.forEach((item) => {
          this.positionsService.removePosition(item);
        });
      }

      return this.findOne(id);
    } catch (err) {
      const newError: ErrorDto = {
        type: ErrorsType.sql,
        message: 'Sets: update()',
        url: req?.originalUrl,
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

    // delete all dir with files
    const innerPath = `/sets/${id}`;
    const uploadPath = path.join(
      process.cwd(),
      process.env.UPLOAD_PATH + innerPath || 'uploads' + innerPath,
    );

    this.imagesService.removeFolderContent(uploadPath);
    this.imagesService.removeFolder(uploadPath);

    // remove files list from files table
    this.filesService.removeFilesFromSet(id);
  }

  validateSetAndHash(setId: number, hash: string): Observable<boolean> {
    return from(
      this.setsRepo
        .createQueryBuilder('set')
        .where('set.id = :id', { id: setId })
        .andWhere('set.hash = :hash', { hash })
        .getCount(),
    ).pipe(map((count) => count > 0));
  }

  validateSetAndHashForSupplier(
    setId: number,
    hash: string,
    supplierHash: string,
  ): Observable<{ isValid: boolean; supplierId?: number }> {
    const setExists$ = from(
      this.setsRepo
        .createQueryBuilder('set')
        .where('set.id = :id', { id: setId })
        .andWhere('set.hash = :hash', { hash })
        .getCount(),
    ).pipe(map((count) => count > 0));

    const supplierId$ = from(
      this.supplierRepo
        .createQueryBuilder('supplier')
        .select('supplier.id', 'id')
        .where('supplier.hash = :supplierHash', { supplierHash })
        .getRawOne<{ id: number }>(),
    ).pipe(map((row) => row?.id ?? null));

    return forkJoin([setExists$, supplierId$]).pipe(
      map(([setExists, supplierId]) => ({
        isValid: setExists && !!supplierId,
        supplierId: supplierId ?? undefined,
      })),
    );
  }
}
