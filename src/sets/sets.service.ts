import { Injectable } from '@nestjs/common';
import { Set } from './sets.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class setsService {
  constructor(
    @InjectRepository(Set)
    private readonly setsRepository: Repository<Set>,
  ) {}

  findAll() {
    return this.setsRepository
      .createQueryBuilder('set') 
      .leftJoin('set.clientId', 'client') 
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
