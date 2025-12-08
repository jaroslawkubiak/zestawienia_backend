import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getFormatedDate } from '../helpers/getFormatedDate';
import { SetsService } from '../sets/sets.service';
import { SuppliersService } from '../suppliers/suppliers.service';
import { SupplierLogs } from './supplier-logs.entity';
import { ISupplierLogs } from './types/ISupplierLogs';
import { ClientsService } from '../clients/clients.service';

@Injectable()
export class SupplierLogsService {
  constructor(
    @InjectRepository(SupplierLogs)
    private readonly supplierLogsRepo: Repository<SupplierLogs>,

    @Inject(forwardRef(() => SetsService))
    private readonly setsService: SetsService,

    @Inject(forwardRef(() => SuppliersService))
    private readonly supplierService: SuppliersService,

    @Inject(forwardRef(() => ClientsService))
    private readonly clientsService: ClientsService,
  ) {}

  async createSupplierEntry(data: ISupplierLogs) {
    const { req_setHash, req_supplierHash } = data;

    const set = await this.setsService.findOneByHash(req_setHash);
    const supplier = await this.supplierService.findOneByHash(req_supplierHash);

    const clientId = set?.clientId?.id;
    const client = clientId
      ? await this.clientsService.findOne(clientId)
      : null;

    const client_name = set
      ? `${set.clientId?.firstName ?? ''} ${set.clientId?.lastName ?? ''}`.trim() ||
        null
      : null;

    const createData: ISupplierLogs = {
      ...data,
      supplier_name: supplier ? supplier.company || null : null,
      client_name,
      set: set || null,
      supplier: supplier || null,
      client: client || null,
      date: getFormatedDate(),
      timestamp: Number(Date.now()),
    };
    const entry = this.supplierLogsRepo.create(createData);

    this.supplierLogsRepo.save(entry).catch((err) => {
      console.error('Error saving supplier login entry:', err);
    });
  }
}
