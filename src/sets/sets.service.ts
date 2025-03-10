import { Injectable } from '@nestjs/common';
import { Set } from './sets.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ISet } from './types/ISet';

@Injectable()
export class setsService {
  constructor(
    @InjectRepository(Set)
    private readonly setsRepo: Repository<Set>,
  ) {}

  findAll(): Promise<ISet[]> {
    return this.setsRepo
      .createQueryBuilder('set')
      .leftJoin('set.client', 'client')
      .addSelect(['client.firma', 'client.email'])
      .leftJoin('set.createdBy', 'createdBy')
      .addSelect(['createdBy.name'])
      .leftJoin('set.updatedBy', 'updatedBy')
      .addSelect(['updatedBy.name'])
      .getMany();
  }
}

function generateHash() {
  const length = 30;
  const characters =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let hash = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    hash += characters[randomIndex];
  }

  return hash;
}
