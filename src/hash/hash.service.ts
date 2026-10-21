import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../clients/clients.entity';
import { generateHash } from '../helpers/generateHash';
import { ClientSet } from '../sets/sets.entity';
import { Supplier } from '../suppliers/suppliers.entity';

@Injectable()
export class HashService {
  constructor(
    @InjectRepository(ClientSet)
    private readonly setRepo: Repository<ClientSet>,
    @InjectRepository(Client)
    private readonly clientRepo: Repository<Client>,
    @InjectRepository(Supplier)
    private readonly supplierRepo: Repository<Supplier>,
  ) {}

  async generateUniqueHash(): Promise<string> {
    let hash: string;
    let exists = true;

    while (exists) {
      hash = generateHash();

      const set = await this.setRepo.findOne({ where: { hash } });
      const client = await this.clientRepo.findOne({ where: { hash } });
      const supplier = await this.supplierRepo.findOne({ where: { hash } });

      exists = !!set || !!client || !!supplier;
    }

    return hash;
  }
}
