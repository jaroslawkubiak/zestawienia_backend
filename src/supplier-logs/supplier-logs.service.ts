import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { ClientsService } from '../clients/clients.service';
import { getFormatedDate } from '../helpers/getFormatedDate';
import { SetsService } from '../sets/sets.service';
import { SuppliersService } from '../suppliers/suppliers.service';
import { SupplierLogs } from './supplier-logs.entity';
import { ISupplierLogs } from './types/ISupplierLogs';

@Injectable()
export class SupplierLogsService {
  constructor(
    @InjectRepository(SupplierLogs)
    private readonly supplierLogsRepository: Repository<SupplierLogs>,

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

    const createData: DeepPartial<SupplierLogs> = {
      success: data.success,
      supplier_name: supplier ? supplier.company || null : null,
      client_name,
      req_setHash,
      req_supplierHash,
      date: getFormatedDate(),
      timestamp: Date.now(),
      set: set ? { id: set?.id } : null,
      supplier: supplier ? { id: supplier?.id } : null,
      client: client ? { id: client?.id } : null,
      ip_address: data.ip_address ?? null,
      user_agent: data.user_agent ?? null,
    };
    const entry = this.supplierLogsRepository.create(createData);

    try {
      await this.supplierLogsRepository.save(entry);
    } catch (err) {
      console.error('Error saving supplier login entry:', err);
    }
  }
}
