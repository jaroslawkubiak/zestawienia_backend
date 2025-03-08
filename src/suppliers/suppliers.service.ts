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
    private readonly suppliersRepository: Repository<Supplier>,
  ) {}

  findAll(): Promise<ISupplier[]> {
    return this.suppliersRepository.find();
  }

  findOne(id: number): Promise<ISupplier> {
    return this.suppliersRepository.findOneBy({ id });
  }

  create(createSupplierDto: CreateSupplierDto): Promise<ISupplier> {
    const newSupplier = this.suppliersRepository.create(createSupplierDto);
    return this.suppliersRepository.save(newSupplier);
  }

  async update(
    id: number,
    updateSupplierDto: UpdateSupplierDto,
  ): Promise<ISupplier> {
    await this.suppliersRepository.update(id, updateSupplierDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.suppliersRepository.delete(id);
  }
}
