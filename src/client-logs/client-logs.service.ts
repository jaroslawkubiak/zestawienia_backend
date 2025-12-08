import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientsService } from 'src/clients/clients.service';
import { Repository } from 'typeorm';
import { getFormatedDate } from '../helpers/getFormatedDate';
import { SetsService } from '../sets/sets.service';
import { ClientLogs } from './client-logs.entity';
import { IClientLogs } from './types/IClientLogs';

@Injectable()
export class ClientLogsService {
  constructor(
    @InjectRepository(ClientLogs)
    private readonly clientLogsRepo: Repository<ClientLogs>,

    @Inject(forwardRef(() => SetsService))
    private readonly setsService: SetsService,

    @Inject(forwardRef(() => ClientsService))
    private readonly clientsService: ClientsService,
  ) {}

  async createClientEntry(data: IClientLogs) {
    const { req_setHash, req_clientHash } = data;

    const set = await this.setsService.findOneByHash(req_setHash);

    const clientId = set?.clientId?.id;
    const client = clientId
      ? await this.clientsService.findOne(clientId)
      : null;

    const client_name = set
      ? `${set.clientId?.firstName ?? ''} ${set.clientId?.lastName ?? ''}`.trim() ||
        null
      : null;

    const createData: IClientLogs = {
      ...data,
      client_name,
      set: set || null,
      client,
      req_setHash,
      req_clientHash,
      date: getFormatedDate(),
      timestamp: Date.now(),
    };

    const entry = this.clientLogsRepo.create(createData);

    try {
      await this.clientLogsRepo.save(entry);
    } catch (err) {
      console.error('Error saving client login entry:', err);
    }
  }
}
