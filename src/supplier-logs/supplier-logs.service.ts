import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getFormatedDate } from '../helpers/getFormatedDate';
import { SetsService } from '../sets/sets.service';
import { SupplierLogs } from './supplier-logs.entity';
import { ISupplierLogs } from './types/ISupplierLogs';
import { SuppliersService } from '../suppliers/suppliers.service';

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

  async createSupplierEntry(data: {
    success: boolean;
    req_setId: string;
    req_hash: string;
    req_supplier_hash: string;
    ip_address?: string | null;
    user_agent?: string | null;
  }) {
    const response = await this.setsService.findOne(Number(data.req_setId));

    const supplier = await this.supplierService.findOneByHash(
      data.req_supplier_hash,
    );

    const createData: ISupplierLogs = {
      ...data,
      supplier_name: supplier ? supplier.company || null : null,
      set: response || null,
      date: getFormatedDate(),
      timestamp: Number(Date.now()),
    };
    const entry = this.supplierLogsRepo.create(createData);

    this.supplierLogsRepo.save(entry).catch((err) => {
      console.error('Error saving supplier login entry:', err);
    });
  }
}
