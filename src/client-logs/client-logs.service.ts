import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
  ) {}

  async createClientEntry(data: IClientLogs) {
    const { req_setHash, req_clientHash } = data;

    const set = await this.setsService.findOneByHash(req_setHash);

    const createData: IClientLogs = {
      ...data,
      client_name: set
        ? `${set.clientId?.firstName ?? ''} ${set.clientId?.lastName ?? ''}`.trim() ||
          null
        : null,
      set: set || null,
      req_setHash,
      req_clientHash,
      date: getFormatedDate(),
      timestamp: Number(Date.now()),
    };
    const entry = this.clientLogsRepo.create(createData);

    this.clientLogsRepo.save(entry).catch((err) => {
      console.error('Error saving client login entry:', err);
    });
  }
}
