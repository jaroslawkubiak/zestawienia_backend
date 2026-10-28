import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getFormatedDate } from '../helpers/getFormatedDate';
import { IPositionLogs } from '../notification-timer/types/IPositionLogs';
import { PositionLogs } from './position-logs.entity';

@Injectable()
export class PositionLogsService {
  constructor(
    @InjectRepository(PositionLogs)
    private readonly positionLogsRepo: Repository<PositionLogs>,
  ) {}

  async createEntry(entry: IPositionLogs) {
    const createEnry: IPositionLogs = {
      ...entry,
      createdAt: getFormatedDate(),
      createdAtTimestamp: Number(Date.now()),
    };

    try {
      await this.positionLogsRepo.save(createEnry);
    } catch (err: any) {
      // Log DB save errors for diagnosis but don't break auth flow
      // eslint-disable-next-line no-console
      console.error('Failed to save login entry', err, createEnry);
    }
  }
}
