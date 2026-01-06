import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { promises as fs } from 'fs';
import * as path from 'path';
import { from, Observable } from 'rxjs';
import { DeepPartial, Repository } from 'typeorm';
import { ErrorDto } from '../errors/dto/error.dto';
import { ErrorsService } from '../errors/errors.service';
import { ErrorsType } from '../errors/types/Errors';
import { getFormatedDate } from '../helpers/getFormatedDate';
import { SetsService } from '../sets/sets.service';
import { Supplier } from '../suppliers/suppliers.entity';
import { SuppliersService } from '../suppliers/suppliers.service';
import { User } from '../user/user.entity';
import { CreateClonePositionDto } from './dto/createClonePosition.dto';
import { CreateEmptyPositionDto } from './dto/createEmptyPosition.dto';
import { UpdatePositionDto } from './dto/updatePosition.dto';
import { Position } from './positions.entity';
import { IPosition } from './types/IPosition';

@Injectable()
export class PositionsService {
  constructor(
    @InjectRepository(Position)
    private readonly positionsRepo: Repository<Position>,
    private readonly errorsService: ErrorsService,
    @Inject(forwardRef(() => SetsService)) private setsService: SetsService,
    @Inject(forwardRef(() => SuppliersService))
    private suppliersService: SuppliersService,
  ) {}

  findOne(id: number): Promise<IPosition> {
    return this.positionsRepo.findOne({
      where: { id },
      relations: ['supplierId'],
    });
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
        'supplier.company',
        'supplier.firstName',
        'supplier.lastName',
      ])
      .leftJoin('position.createdBy', 'createdBy')
      .addSelect(['createdBy.id', 'createdBy.name'])
      .leftJoin('position.updatedBy', 'updatedBy')
      .addSelect(['updatedBy.id', 'updatedBy.name']);

    return from(query.getMany());
  }

  getPositionsForSuppliers(
    setId: number,
    supplierId: number,
  ): Observable<IPosition[]> {
    const query = this.positionsRepo
      .createQueryBuilder('position')
      .where('position.setId = :id', { id: setId })
      .andWhere('supplier.id = :supplierId', { supplierId })
      .leftJoin('position.supplierId', 'supplier')
      .orderBy('position.kolejnosc', 'ASC');
    return from(query.getMany());
  }

  async update(
    userId: number,
    positions: UpdatePositionDto[],
    req: Request,
  ): Promise<any> {
    try {
      positions.forEach((position) => {
        const savedPosition = {
          ...position,
          updatedBy: { id: userId } as DeepPartial<User>,
          supplierId: position?.supplierId as DeepPartial<Supplier>,
          updatedAt: getFormatedDate(),
          updatedAtTimestamp: Number(Date.now()),
        };

        this.updateOne(position.id, savedPosition, req.originalUrl);
      });
    } catch (err) {
      const newError: ErrorDto = {
        type: ErrorsType.sql,
        message: 'Position: update()',
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

  async updateOne(
    id: number,
    updatePosition: UpdatePositionDto,
    url: string = 'null',
  ): Promise<any> {
    try {
      const oldPosition = await this.findOne(id);
      const oldSupplierId = oldPosition?.supplierId?.id;
      const updateResult = await this.positionsRepo.update(id, updatePosition);

      if (updateResult?.affected === 0) {
        throw new NotFoundException(`Position with ID ${id} not found`);
      } else {
        //update positionCount for new supplier
        const findSupplierId = updatePosition?.supplierId?.id;
        if (findSupplierId) {
          this.updatePositionCountBySupplierId(findSupplierId);
        }

        //update positionCount for old supplier
        if (findSupplierId !== oldSupplierId) {
          this.updatePositionCountBySupplierId(oldSupplierId);
        }

        return this.findOne(id);
      }
    } catch (err) {
      const newError: ErrorDto = {
        type: ErrorsType.sql,
        message: 'Position: updateOne()',
        url,
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

  async updateImage(
    userId: number,
    setId: number,
    setHash: string,
    positionId: number,
    filename: string,
  ) {
    try {
      const updatedByUser = { id: userId } as DeepPartial<User>;
      const positionFromDB = await this.findOne(positionId);
      const setFromDB = await this.setsService.findOne(setId);

      if (positionFromDB && setFromDB) {
        const query = await this.positionsRepo
          .createQueryBuilder()
          .update(Position)
          .set({
            image: filename,
            updatedAt: getFormatedDate(),
            updatedAtTimestamp: Number(Date.now()),
            updatedBy: updatedByUser,
          })
          .where('setId = :setId AND id = :positionId', {
            setId: setId,
            positionId: positionId,
          })
          .execute();

        if (query?.affected !== 0) {
          return 'Obraz został przesłany na serwer.';
        }
      } else {
        if (!positionFromDB) {
          throw new Error(`Pozycja o ID ${positionId} nie istnieje w bazie.`);
        }

        if (!setFromDB) {
          throw new Error(`Zestawienie o ID ${setId} nie istnieje w bazie.`);
        }
      }
    } catch (err) {
      const url = `/images/${setId}/${setHash}/${positionId}`;
      const newError: ErrorDto = {
        type: ErrorsType.sql,
        message: 'Images: updateImage()',
        url,
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

  // delete position
  async removePosition(
    id: number,
    setId: number,
    setHash: string,
  ): Promise<void> {
    const position = await this.findOne(id);

    if (!position) {
      throw new NotFoundException(`Position with ID ${id} not found`);
    }

    if (position.image) {
      const basePath = process.env.UPLOAD_PATH || 'uploads';

      const dirPath = path.join(
        process.cwd(),
        basePath,
        'sets',
        String(setId),
        setHash,
        'positions',
        String(id),
      );

      await removeDirSafe(dirPath);
    }

    await this.positionsRepo.delete(id);

    const supplierId = position?.supplierId?.id;
    if (supplierId) {
      await this.updatePositionCountBySupplierId(supplierId);
    }
  }

  // when add new empty position
  async addPosition(
    createEmptyPositionDto: CreateEmptyPositionDto,
  ): Promise<IPosition> {
    const positionToSave = {
      ...createEmptyPositionDto,
      createdAt: getFormatedDate(),
      createdAtTimestamp: Number(Date.now()),
      updatedAt: getFormatedDate(),
      updatedAtTimestamp: Number(Date.now()),
    };

    const newPosition = this.positionsRepo.create(positionToSave);
    return this.positionsRepo.save(newPosition);
  }

  // when clone position
  async clonePosition(
    createClonePositionDto: CreateClonePositionDto,
  ): Promise<IPosition> {
    const positionToSave = {
      ...createClonePositionDto,
      createdAt: getFormatedDate(),
      createdAtTimestamp: Number(Date.now()),
      updatedAt: getFormatedDate(),
      updatedAtTimestamp: Number(Date.now()),
    };
    const newPosition = this.positionsRepo.create(positionToSave);

    //update positionCount to supplier
    const findSupplierId = positionToSave?.supplierId?.id;
    if (findSupplierId) {
      this.updatePositionCountBySupplierId(findSupplierId);
    }

    return this.positionsRepo.save(newPosition);
  }

  // count position count for supplierId
  async getPositionsCountBySupplierId(supplierId: number): Promise<number> {
    const query = await this.positionsRepo
      .createQueryBuilder('position')
      .select('COUNT(position.supplierId)', 'positionCount')
      .where('position.supplierId = :supplierId', { supplierId })
      .getRawOne();

    const positionCount = parseInt(query.positionCount, 10);

    return positionCount;
  }

  async updatePositionCountBySupplierId(supplierId: number): Promise<void> {
    if (!supplierId) return;
    const positionCount = await this.getPositionsCountBySupplierId(supplierId);

    const updateSupplier = {
      positionCount,
    };

    await this.suppliersService.update(supplierId, updateSupplier);
  }
}

async function pathExists(dirPath: string): Promise<boolean> {
  try {
    await fs.access(dirPath);
    return true;
  } catch {
    return false;
  }
}

async function removeDirSafe(dirPath: string): Promise<void> {
  if (await pathExists(dirPath)) {
    await fs.rm(dirPath, { recursive: true, force: true });
  }
}
