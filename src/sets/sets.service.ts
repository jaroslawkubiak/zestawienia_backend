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
import { DeepPartial, Repository } from 'typeorm';
import { Bookmark } from '../bookmarks/bookmarks.entity';
import { ClientLogsService } from '../client-logs/client-logs.service';
import { Client } from '../clients/clients.entity';
import { ClientsService } from '../clients/clients.service';
import { CommentsService } from '../comments/comments.service';
import { IComment } from '../comments/types/IComment';
import { ErrorDto } from '../errors/dto/error.dto';
import { ErrorsService } from '../errors/errors.service';
import { ErrorsType } from '../errors/types/Errors';
import { FilesService } from '../files/files.service';
import { HashService } from '../hash/hash.service';
import { getClientIp } from '../helpers/getClientIp';
import { getFormatedDate } from '../helpers/getFormatedDate';
import { ImagesService } from '../images/images.service';
import { Position } from '../position/positions.entity';
import { PositionsService } from '../position/positions.service';
import { SupplierLogsService } from '../supplier-logs/supplier-logs.service';
import { Supplier } from '../suppliers/suppliers.entity';
import { User } from '../user/user.entity';
import { NewSetDto } from './dto/NewSet.dto';
import { UpdateSetAndPositionDto } from './dto/updateSetAndPosition.dto';
import { Set } from './sets.entity';
import { ISavedSet } from './types/ISavedSet';
import { ISet } from './types/ISet';
import { ISetForSupplier } from './types/ISetForSupplier';
import { IValidSetForClient } from './types/IValidSetForClient';
import { IValidSetForSupplier } from './types/IValidSetForSupplier';
import { SetStatus } from './types/SetStatus';

@Injectable()
export class SetsService {
  constructor(
    private readonly errorsService: ErrorsService,
    private readonly hashService: HashService,

    @Inject(forwardRef(() => ClientLogsService))
    private readonly clientLogsService: ClientLogsService,

    @Inject(forwardRef(() => SupplierLogsService))
    private readonly supplierLogsService: SupplierLogsService,

    @InjectRepository(Set)
    private readonly setsRepo: Repository<Set>,

    @InjectRepository(Supplier)
    private readonly supplierRepo: Repository<Supplier>,

    @InjectRepository(Position)
    private readonly positionRepo: Repository<Position>,

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

  async findOne(id: number): Promise<ISet> {
    return this.setsRepo
      .createQueryBuilder('set')
      .where('set.id = :id', { id: id })
      .leftJoin('set.clientId', 'client')
      .addSelect([
        'client.id',
        'client.firstName',
        'client.lastName',
        'client.company',
        'client.email',
        'client.hash',
      ])
      .getOne();
  }

  async findOneByHash(hash: string): Promise<ISet> {
    return this.setsRepo
      .createQueryBuilder('set')
      .where('set.hash = :hash', { hash: hash })
      .leftJoin('set.clientId', 'client')
      .addSelect([
        'client.id',
        'client.firstName',
        'client.lastName',
        'client.company',
        'client.email',
        'client.hash',
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
        'client.hash',
      ])
      .leftJoin('set.createdBy', 'createdBy')
      .addSelect(['createdBy.name'])
      .leftJoin('set.updatedBy', 'updatedBy')
      .addSelect(['updatedBy.name'])
      .leftJoinAndSelect('set.comments', 'comments')
      .leftJoinAndSelect('set.files', 'files')
      .leftJoin('files.setId', 'fileSet')
      .addSelect(['fileSet.id'])
      .orderBy('set.id', 'DESC')
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
          'client.hash',
        ])
        .leftJoin('set.createdBy', 'createdBy')
        .addSelect(['createdBy.id', 'createdBy.name'])
        .leftJoin('set.updatedBy', 'updatedBy')
        .addSelect(['updatedBy.id', 'updatedBy.name'])
        .leftJoinAndSelect('set.files', 'files')
        .leftJoin('files.setId', 'fileSet')
        .addSelect(['fileSet.id', 'fileSet.hash'])
        .leftJoin('set.lastBookmark', 'lastBookmark')
        .addSelect(['lastBookmark.id'])
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

  getSetForSupplier(setId: number): Observable<ISetForSupplier> {
    return from(
      this.setsRepo
        .createQueryBuilder('set')
        .select(['set.id', 'set.name', 'set.address'])
        .where('set.id = :id', { id: setId })
        .leftJoin('set.clientId', 'client')
        .addSelect([
          'client.id',
          'client.company',
          'client.email',
          'client.firstName',
          'client.lastName',
        ])
        .getOne(),
    ).pipe(
      mergeMap((set) => {
        if (!set) {
          return throwError(() => new Error('Set not found'));
        }

        return of(set);
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
    const bookmarks = createSet.bookmarks;
    const minBookmarkId = Math.min(...bookmarks.map((b) => b.id));

    try {
      const newSet: DeepPartial<Set> = {
        ...createSet,
        createdBy: { id: createSet.createdBy } as DeepPartial<User>,
        updatedBy: { id: createSet.createdBy } as DeepPartial<User>,
        clientId: { id: createSet.clientId } as DeepPartial<Client>,
        hash: await this.hashService.generateUniqueHash(),
        status: SetStatus.new,
        createdAt: getFormatedDate(),
        createdAtTimestamp: Number(Date.now()),
        updatedAt: getFormatedDate(),
        updatedAtTimestamp: Number(Date.now()),
        lastBookmark: { id: minBookmarkId } as Bookmark,
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
    setId: number,
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
      const updateSetResult = await this.setsRepo.update(setId, savedSet);

      if (updateSetResult?.affected === 0) {
        throw new NotFoundException(`Set with ID ${setId} not found`);
      }

      if (positions) {
        await this.positionsService.update(userId, positions, req);
      }

      const set = await this.findOne(setId);

      // delete positions
      if (positionToDelete?.length > 0) {
        for (const positionId of positionToDelete) {
          await this.positionsService.removePosition(
            positionId,
            setId,
            set.hash,
          );
        }
      }

      return this.findOne(setId);
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

    await this.clientsService.update(clientId, updateClient);

    // delete all dir with files
    const innerPath = `/sets/${id}`;
    const uploadPath = path.join(
      process.cwd(),
      process.env.UPLOAD_PATH + innerPath || 'uploads' + innerPath,
    );

    this.imagesService.removeFolderContent(uploadPath);
    this.imagesService.removeFolder(uploadPath);

    // remove files list from files table
    await this.filesService.removeFilesFromSet(id);
  }

  validateSetAndHashForSupplier(
    setHash: string,
    supplierHash: string,
    req: Request,
  ): Observable<IValidSetForSupplier | null> {
    const set$ = from(
      this.setsRepo
        .createQueryBuilder('set')
        .leftJoin('set.clientId', 'client')
        .select([
          'set.id',
          'set.name',
          'client.id',
          'client.company',
          'client.firstName',
          'client.lastName',
        ])
        .where('set.hash = :setHash', { setHash })
        .getOne(),
    ).pipe(
      map((set) => {
        console.log('Fetched set:', set); // <-- tutaj logujesz
        return set
          ? {
              setId: set.id,
              setName: set.name,
              client: {
                id: set.clientId.id,
                company: set.clientId.company,
                firstName: set.clientId.firstName,
                lastName: set.clientId.lastName,
              },
            }
          : null;
      }),
    );

    const supplier$ = from(
      this.supplierRepo
        .createQueryBuilder('supplier')
        .select([
          'supplier.id',
          'supplier.company',
          'supplier.firstName',
          'supplier.lastName',
        ])
        .where('supplier.hash = :supplierHash', { supplierHash })
        .getOne(),
    ).pipe(
      map((sup) =>
        sup
          ? {
              id: sup.id,
              company: sup.company,
              firstName: sup.firstName,
              lastName: sup.lastName,
            }
          : null,
      ),
    );

    return forkJoin([set$, supplier$]).pipe(
      switchMap(([setData, supplier]) => {
        const isValid = !!setData && !!supplier;

        this.supplierLogsService.createSupplierEntry({
          success: isValid,
          req_setHash: setHash,
          req_supplierHash: supplierHash,
          ip_address: getClientIp(req),
          user_agent: req.headers['user-agent'] ?? null,
        });

        // hashes are not good - return null
        if (!isValid) {
          return of(null);
        }

        // both hashes are good - get position data
        return from(
          this.positionRepo
            .createQueryBuilder('position')
            .where('position.setId = :setId', { setId: setData.setId })
            .andWhere('position.supplierId = :supplierId', {
              supplierId: supplier.id,
            })
            .orderBy('position.bookmarkId', 'ASC')
            .addOrderBy('position.kolejnosc', 'ASC')
            .getMany(),
        ).pipe(
          map((positions) => ({
            valid: true,
            setId: setData.setId,
            setName: setData.setName,
            supplier: {
              id: supplier.id,
              company: supplier.company,
              firstName: supplier.firstName,
              lastName: supplier.lastName,
            },
            client: {
              id: setData.client?.id ?? null,
              company: setData.client?.company ?? null,
              firstName: setData.client?.firstName ?? null,
              lastName: setData.client?.lastName ?? null,
            },
            positions,
          })),
        );
      }),
    );
  }

  validateSetAndHashForClient(
    setHash: string,
    clientHash: string,
    req: Request,
  ): Observable<IValidSetForClient | null> {
    const set$ = from(
      this.setsRepo
        .createQueryBuilder('set')
        .innerJoin('set.clientId', 'client')
        .where('set.hash = :setHash', { setHash })
        .andWhere('client.hash = :clientHash', { clientHash })
        .select(['set.id'])
        .getOne(),
    );

    return set$.pipe(
      switchMap((set) => {
        const isValid = !!set;

        this.clientLogsService.createClientEntry({
          success: isValid,
          req_setHash: setHash,
          req_clientHash: clientHash,
          ip_address: getClientIp(req),
          user_agent: req.headers['user-agent'] ?? null,
        });

        if (!isValid) return of(null);

        const setId = set.id;

        const setDetails$ = from(this.getSet(setId));
        const comments$ = from(this.commentsService.findBySetId(setId));
        const positions$ = this.positionsService.getPositions(setId);

        return forkJoin([setDetails$, comments$, positions$]).pipe(
          map(([set, comments, positions]) => {
            const newCommentsCount =
              comments?.filter((c) => !c.seenAt).length ?? 0;
            const fullName = `${set.clientId.firstName} ${set.clientId.lastName}`;

            return {
              valid: true,
              set: {
                ...set,
                comments,
                newComments: newCommentsCount,
                fullName,
              },
              positions,
            } as IValidSetForClient;
          }),
        );
      }),
    );
  }
}
