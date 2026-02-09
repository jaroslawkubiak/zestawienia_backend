import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { ClientsService } from '../clients/clients.service';
import { getFormatedDate } from '../helpers/getFormatedDate';
import { SetsService } from '../sets/sets.service';
import { ClientLogs } from './client-logs.entity';
import { IClientLogs } from './types/IClientLogs';

@Injectable()
export class ClientLogsService {
  constructor(
    @InjectRepository(ClientLogs)
    private readonly clientLogsRepository: Repository<ClientLogs>,

    @Inject(forwardRef(() => SetsService))
    private readonly setsService: SetsService,

    @Inject(forwardRef(() => ClientsService))
    private readonly clientsService: ClientsService,
  ) {}

  async createClientEntry(data: IClientLogs) {
    const { req_setHash, req_clientHash } = data;

    const set = await this.setsService.findOneSetByHash(req_setHash);
    const client = await this.clientsService.findOneByHash(req_clientHash);

    const client_name = client
      ? `${client.firstName ?? ''} ${client.lastName ?? ''}`.trim() || null
      : null;

    const createData: DeepPartial<ClientLogs> = {
      ...data,
      client_name,
      set: set ? { id: set?.id } : null,
      client: client ? { id: client?.id } : null,
      req_setHash,
      req_clientHash,
      date: getFormatedDate(),
      timestamp: Date.now(),
    };

    const entry = this.clientLogsRepository.create(createData);

    try {
      await this.clientLogsRepository.save(entry);
    } catch (err) {
      console.error('Error saving client login entry:', err);
    }
  }
}
