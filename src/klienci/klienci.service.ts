import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Klient } from './klienci.entity';
import { Repository } from 'typeorm';
import { IKlient } from './types/IKlient';

@Injectable()
export class KlienciService {
  constructor(
    @InjectRepository(Klient)
    private readonly clientRepository: Repository<Klient>,
  ) {}

  async getClients(): Promise<IKlient[]> {
    const klienci = await this.clientRepository.find();

    return klienci;
  }
}
