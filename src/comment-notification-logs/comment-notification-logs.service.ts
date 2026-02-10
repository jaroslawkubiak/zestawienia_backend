import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentNotificationLogs } from './comment-notification-logs.entity';
import { CommentNotificationDto } from './types/commentNotification.dto';

@Injectable()
export class CommentNotificationLogsService {
  constructor(
    @InjectRepository(CommentNotificationLogs)
    private readonly commentNotificationLogsRepository: Repository<CommentNotificationLogs>,
  ) {}

  async saveLog(emailLog: CommentNotificationDto): Promise<void> {
    const newLog = this.commentNotificationLogsRepository.create(emailLog);
    this.commentNotificationLogsRepository.save(newLog);
  }
}
