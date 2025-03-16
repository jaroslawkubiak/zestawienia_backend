import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorDto } from './dto/error.dto';
import { Errors } from './errors.entity';
import { IError } from './types/IError';

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
    await this.create(error);
  }
}
