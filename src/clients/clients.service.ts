import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { ErrorDto } from '../errors/dto/error.dto';
import { ErrorsService } from '../errors/errors.service';
import { ErrorsType } from '../errors/types/Errors';
import { getFormatedDate } from '../helpers/getFormatedDate';
import { Client } from './clients.entity';
import { CreateClientDto, UpdateClientDto } from './dto/client.dto';
import { IClient } from './types/IClient';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientsRepo: Repository<Client>,
    private errorsService: ErrorsService,
  ) {}

  findAll(): Promise<IClient[]> {
    return this.clientsRepo.find({
      order: {
        id: 'DESC',
      },
    });
  }

  findOne(id: number): Promise<IClient> {
    return this.clientsRepo.findOneBy({ id });
  }

  create(createClientDto: CreateClientDto): Promise<IClient> {
    const newClient = this.clientsRepo.create(createClientDto);
    return this.clientsRepo.save(newClient);
  }

  async update(
    id: number,
    updateClientDto: UpdateClientDto,
    req?: Request,
  ): Promise<IClient> {
    try {
      const updateResult = await this.clientsRepo.update(id, updateClientDto);

      if (updateResult?.affected === 0) {
        throw new NotFoundException(`Client with ID ${id} not found`);
      } else {
        return this.findOne(id);
      }
    } catch (err) {
      const newError: ErrorDto = {
        type: ErrorsType.sql,
        message: 'Client: update()',
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

  async remove(id: number): Promise<void> {
    await this.clientsRepo.delete(id);
  }
}
