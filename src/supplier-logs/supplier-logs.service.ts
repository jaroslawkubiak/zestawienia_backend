import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getFormatedDate } from '../helpers/getFormatedDate';
import { SetsService } from '../sets/sets.service';
import { SuppliersService } from '../suppliers/suppliers.service';
import { SupplierLogs } from './supplier-logs.entity';
import { ISupplierLogs } from './types/ISupplierLogs';

@Injectable()
export class SupplierLogsService {
  constructor(
    @InjectRepository(SupplierLogs)
    private readonly supplierLogsRepo: Repository<SupplierLogs>,

    @Inject(forwardRef(() => SetsService))
    private readonly setsService: SetsService,

    @Inject(forwardRef(() => SuppliersService))
    private readonly supplierService: SuppliersService,
  ) {}

  async createSupplierEntry(data: ISupplierLogs) {
    const { req_setHash, req_supplierHash } = data;

    const set = await this.setsService.findOneByHash(req_setHash);
    const supplier = await this.supplierService.findOneByHash(req_supplierHash);

    const createData: ISupplierLogs = {
      ...data,
      supplier_name: supplier ? supplier.company || null : null,
      set: set || null,
      date: getFormatedDate(),
      timestamp: Number(Date.now()),
    };
    const entry = this.supplierLogsRepo.create(createData);

    this.supplierLogsRepo.save(entry).catch((err) => {
      console.error('Error saving supplier login entry:', err);
    });
  }
}
