import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { getFormatedDate } from '../helpers/getFormatedDate';
import { User } from '../user/user.entity';
import { NotificationLogDto } from './dto/notificationLog.dto';
import { NotificationLogs } from './notification-logs.entity';
import { INotificationLogs } from './types/INotificationLogs';

@Injectable()
export class NotificationLogsService {
  constructor(
    @InjectRepository(NotificationLogs)
    private readonly notificationLogsRepository: Repository<NotificationLogs>,
  ) {}

  async addNotificationLog(
    createLogDto: NotificationLogDto,
  ): Promise<INotificationLogs> {
    const newComment: DeepPartial<NotificationLogs> = {
      ...createLogDto,
      user: { id: createLogDto.userId } as User,
      createdAt: getFormatedDate(),
      createdAtTimestamp: Number(Date.now()),
    };

    return await this.notificationLogsRepository.save(newComment);
  }
}
