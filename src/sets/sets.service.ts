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
    console.log(`##### service findall #####`);
    return this.setsRepository.find();
  }
}
