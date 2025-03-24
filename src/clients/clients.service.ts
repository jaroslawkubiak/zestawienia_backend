import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './clients.entity';
import { CreateClientDto, UpdateClientDto } from './dto/client.dto';
import { IClient } from './types/IClient';
import { getFormatedDate } from '../helpers/getFormatedDate';
import { ErrorsService } from '../errors/errors.service';
import { ErrorDto } from '../errors/dto/error.dto';
import { Request } from 'express';

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
    } catch (error) {
      const newError: ErrorDto = {
        type: 'MySQL',
        message: 'Clients: Błąd bazy danych',
        url: req.originalUrl,
        error: JSON.stringify(error.message) || 'null',
        query: JSON.stringify(error.query) || 'null',
        parameters: error.parameters ? error.parameters[0] : 'null',
        sql: error.driverError ? error.driverError.sql : 'null',
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
    await this.clientsRepo.delete(id);
  }
}
