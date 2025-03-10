import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSupplierDto, UpdateSupplierDto } from './dto/supplier.dto';
import { Supplier } from './suppliers.entity';
import { ISupplier } from './types/ISupplier';

@Injectable()
export class SuppliersService {
  constructor(
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

  create(createSupplierDto: CreateSupplierDto): Promise<ISupplier> {
    const newSupplier = this.suppliersRepo.create(createSupplierDto);
    return this.suppliersRepo.save(newSupplier);
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
