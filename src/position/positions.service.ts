import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable, from } from 'rxjs';
import { DeepPartial, Repository } from 'typeorm';
import { ErrorsService } from '../errors/errors.service';
import { Position } from './positions.entity';
import { IPosition } from './types/IPosition';
import { UpdatePositionDto } from './dto/updatePosition.dto';
import { ErrorDto } from '../errors/dto/error.dto';
import { getFormatedDate } from '../helpers/getFormatedDate';
import { Request } from 'express';
import { User } from '../user/user.entity';

@Injectable()
export class PositionsService {
  constructor(
    @InjectRepository(Position)
    private readonly positionsRepo: Repository<Position>,
    private readonly errorsService: ErrorsService,
  ) {}

  findOne(id: number): Promise<IPosition> {
    return this.positionsRepo.findOneBy({ id });
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
          updatedAt: getFormatedDate(),
          updatedAtTimestamp: Number(Date.now()),
        };

        this.updateOne(position.id, savedPosition, req.originalUrl);
      });
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

  async updateOne(
    id: number,
    position: UpdatePositionDto,
    url: string = '',
  ): Promise<any> {
    try {
      const updateData = {
        ...position,
        supplierId: { id: position.supplierId },
      };
      const updateResult = await this.positionsRepo.update(id, updateData);

      if (updateResult?.affected === 0) {
        throw new NotFoundException(`Position with ID ${id} not found`);
      } else {
        return this.findOne(id);
      }
    } catch (error) {
      const newError: ErrorDto = {
        type: 'MySQL',
        message: 'Błąd bazy danych',
        url,
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
