import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './clients.entity';
import { Repository } from 'typeorm';
import { IClient } from './types/IClient';
import { CreateClientDto, UpdateClientDto } from './dto/client.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientsRepository: Repository<Client>,
  ) {}

  findAll(): Promise<IClient[]> {
    return this.clientsRepository.find();
  }

  findOne(id: number): Promise<IClient> {
    return this.clientsRepository.findOneBy({ id });
  }

  create(createClientDto: CreateClientDto): Promise<IClient> {
    const newClient = this.clientsRepository.create(createClientDto);
    return this.clientsRepository.save(newClient);
  }

  async update(id: number, updateClientDto: UpdateClientDto): Promise<IClient> {
    await this.clientsRepository.update(id, updateClientDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.clientsRepository.delete(id);
  }
}
