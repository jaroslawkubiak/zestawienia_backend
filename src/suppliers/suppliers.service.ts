import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HashService } from '../hash/hash.service';
import { CreateSupplierDto, UpdateSupplierDto } from './dto/supplier.dto';
import { Supplier } from './suppliers.entity';
import { ISupplier } from './types/ISupplier';

@Injectable()
export class SuppliersService {
  constructor(
    private readonly hashService: HashService,

    @InjectRepository(Supplier)
    private readonly suppliersRepo: Repository<Supplier>,
  ) {}

  findAll(): Promise<ISupplier[]> {
    return this.suppliersRepo.find({
      order: {
        id: 'DESC',
      },
    });
  }

  findOne(id: number): Promise<ISupplier> {
    return this.suppliersRepo.findOneBy({ id });
  }

  findOneByHash(hash: string): Promise<ISupplier> {
    return this.suppliersRepo.findOneBy({ hash });
  }

  async create(createSupplierDto: CreateSupplierDto): Promise<ISupplier> {
    const newSupplier = {
      ...createSupplierDto,
      hash: await this.hashService.generateUniqueHash(),
    };
    const res = this.suppliersRepo.create(newSupplier);
    return this.suppliersRepo.save(res);
  }

  async update(
    id: number,
    updateSupplierDto: UpdateSupplierDto,
  ): Promise<ISupplier> {
    await this.suppliersRepo.update(id, updateSupplierDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.suppliersRepo.delete(id);
  }
}
