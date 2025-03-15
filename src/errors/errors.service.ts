import { Injectable } from '@nestjs/common';
import { Errors } from './errors.entity';
import { IError } from './types/IError';
import { ErrorDto } from './dto/error.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getFormatedDate } from 'src/helpers/getFormatedDate';

@Injectable()
export class ErrorsService {
  constructor(
    @InjectRepository(Errors)
    private readonly errosRepo: Repository<Errors>,
  ) {}

  async create(newError: ErrorDto): Promise<IError> {
    try {
      const createdError = this.errosRepo.create(newError);
      return await this.errosRepo.save(createdError);
    } catch (err) {
      console.error('❌ Błąd zapisu błędu:', err);
      throw new Error('Nie udało się zapisać błędu do bazy');
    }
  }

  async prepareError(error: any) {
    const newError = {
      type: 'MySQL',
      message: 'Błąd bazy danych',
      error: error.message,
      query: error.query || null,
      parameters: error.parameters[0] || null,
      sql: error.driverError.sql || null,
      createdAt: getFormatedDate(),
      createdAtTimestamp: Number(Date.now()),
    };

    await this.create(newError);
  }
}
