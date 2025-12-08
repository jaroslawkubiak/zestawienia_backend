import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './clients.entity';
import { CreateClientDto, UpdateClientDto } from './dto/client.dto';
import { IClient } from './types/IClient';
import { generateHash } from '../helpers/generateHash';

@Injectable()
export class ClientsService {
  constructor(
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

  create(createClientDto: CreateClientDto): Promise<IClient> {
    const newClient = { ...createClientDto, hash: generateHash() };

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
