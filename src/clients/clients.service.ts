import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HashService } from '../hash/hash.service';
import { Client } from './clients.entity';
import { CreateClientDto, UpdateClientDto } from './dto/client.dto';
import { IClient } from './types/IClient';

@Injectable()
export class ClientsService {
  constructor(
    private readonly hashService: HashService,

    @InjectRepository(Client)
    private readonly clientsRepo: Repository<Client>,
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

  async create(createClientDto: CreateClientDto): Promise<IClient> {
    const newClient = {
      ...createClientDto,
      hash: await this.hashService.generateUniqueHash(),
    };

    this.clientsRepo.create(createClientDto);
    return this.clientsRepo.save(newClient);
  }

  async update(id: number, updateClientDto: UpdateClientDto): Promise<IClient> {
    await this.clientsRepo.update(id, updateClientDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.clientsRepo.delete(id);
  }
}
