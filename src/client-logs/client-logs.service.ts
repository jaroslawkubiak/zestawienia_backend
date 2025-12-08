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

  async createClientEntry(data: {
    success: boolean;
    req_setId: string;
    req_hash: string;
    ip_address?: string | null;
    user_agent?: string | null;
  }) {
    const response = await this.setsService.findOne(Number(data.req_setId));

    const createData: IClientLogs = {
      ...data,
      client_name: response
        ? `${response.clientId?.firstName ?? ''} ${response.clientId?.lastName ?? ''}`.trim() ||
          null
        : null,
      set: response || null,
      date: getFormatedDate(),
      timestamp: Number(Date.now()),
    };
    const entry = this.clientLogsRepo.create(createData);

    this.clientLogsRepo.save(entry).catch((err) => {
      console.error('Error saving client login entry:', err);
    });
  }
}
