import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HashService } from '../hash/hash.service';
import { Client } from './clients.entity';
import { CreateClientDto } from './dto/client.dto';
import { UpdateClientDto } from './dto/updateClient.dto';
import { IClient } from './types/IClient';

@Injectable()
export class ClientsService {
  constructor(
    private readonly hashService: HashService,

    @InjectRepository(Client)
    private readonly clientsRepo: Repository<Client>,
  ) {}

  async getClients(): Promise<IClient[]> {
    const clients = await this.clientsRepo
      .createQueryBuilder('client')
      .leftJoin('client.set', 'set')
      .addSelect('COUNT(set.id)', 'setCount')
      .leftJoin('client.avatar', 'avatar')
      .addSelect(['avatar.id', 'avatar.fileName', 'avatar.path', 'avatar.type'])
      .groupBy('client.id')
      .orderBy('client.id', 'DESC')
      .getRawAndEntities();

    return clients.entities.map((client, index) => {
      const setCount = Number(clients.raw[index].setCount);
      return this.mapToClient(client, setCount);
    });
  }

  async findOneClient(id: number): Promise<IClient> {
    const result = await this.clientsRepo
      .createQueryBuilder('client')
      .loadRelationCountAndMap('client.setCount', 'client.set')
      .leftJoin('client.avatar', 'avatar')
      .addSelect(['avatar.id', 'avatar.fileName', 'avatar.path', 'avatar.type'])
      .where('client.id = :id', { id })
      .getOne();
    return result;
  }

  findOneByHash(hash: string): Promise<IClient | null> {
    return this.clientsRepo.findOneBy({ hash });
  }

  async addClient(createClientDto: CreateClientDto): Promise<IClient> {
    const newClient = this.clientsRepo.create({
      ...createClientDto,
      avatar: { id: createClientDto.avatar.id },
      hash: await this.hashService.generateUniqueHash(),
    });
    const savedClient = await this.clientsRepo.save(newClient);

    return await this.findOneClient(savedClient.id);
  }

  async updateClientAvatar(clientId: number, avatarId: number): Promise<void> {
    await this.clientsRepo
      .createQueryBuilder()
      .update('client')
      .set({
        avatar: { id: avatarId },
      })
      .where('id = :clientId', { clientId })
      .execute();
  }

  async updateClient(
    id: number,
    updateClientDto: UpdateClientDto,
  ): Promise<IClient> {
    const updateData = {
      ...updateClientDto,
      avatar: updateClientDto.avatar ? { id: updateClientDto.avatar.id } : null,
    };

    await this.clientsRepo.update(id, updateData);

    return this.findOneClient(id);
  }

  async deleteClient(id: number): Promise<void> {
    await this.clientsRepo.delete(id);
  }

  private mapToClient(client: Client, setCount: number): IClient {
    return {
      id: client.id,
      company: client.company,
      firstName: client.firstName,
      lastName: client.lastName,
      email: client.email,
      secondEmail: client.secondEmail,
      hash: client.hash,
      telephone: client.telephone,
      setCount: setCount,
      avatar: client.avatar,
    };
  }
}
