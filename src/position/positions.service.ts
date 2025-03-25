import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { from, Observable } from 'rxjs';
import { DeepPartial, Repository } from 'typeorm';
import { ErrorDto } from '../errors/dto/error.dto';
import { ErrorsService } from '../errors/errors.service';
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
        'supplier.firma',
        'supplier.imie',
        'supplier.nazwisko',
      ])
      .leftJoin('position.createdBy', 'createdBy')
      .addSelect(['createdBy.id', 'createdBy.name'])
      .leftJoin('position.updatedBy', 'updatedBy')
      .addSelect(['updatedBy.id', 'updatedBy.name']);

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
    } catch (error) {
      const newError: ErrorDto = {
        type: 'MySQL',
        message: 'Positions: Błąd bazy danych',
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
    } catch (error) {
      const newError: ErrorDto = {
        type: 'MySQL',
        message: 'Positions: Błąd bazy danych',
        url,
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

  async updateImage(
    userId: number,
    setId: number,
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
    } catch (error) {
      const url = `/images/${setId}/${positionId}`;
      const newError: ErrorDto = {
        type: 'MySQL',
        message: 'Images: Błąd bazy danych',
        url,
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

  // delete position
  async removePosition(id: number): Promise<void> {
    const removedPosition = await this.findOne(id);
    const result = await this.positionsRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Position with ID ${id} not found`);
    } else {
      //update positionCount to supplier
      const findSupplierId = removedPosition?.supplierId?.id;
      if (findSupplierId) {
        this.updatePositionCountBySupplierId(findSupplierId);
      }
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
