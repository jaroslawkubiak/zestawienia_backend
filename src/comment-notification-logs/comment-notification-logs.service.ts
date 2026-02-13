import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { minifyHtml } from '../helpers/minifyHtml';
import { CommentNotificationLogs } from './comment-notification-logs.entity';
import { CommentNotificationDto } from './types/commentNotification.dto';

@Injectable()
export class CommentNotificationLogsService {
  constructor(
    @InjectRepository(CommentNotificationLogs)
    private readonly commentNotificationLogsRepository: Repository<CommentNotificationLogs>,
  ) {}

  async saveLog(commentNotificationDto: CommentNotificationDto): Promise<void> {
    const cleanedHtmlContent = minifyHtml(commentNotificationDto.content);

    const newLog = this.commentNotificationLogsRepository.create({
      ...commentNotificationDto,
      content: cleanedHtmlContent,
      set: { id: commentNotificationDto.setId },
      client: { id: commentNotificationDto.clientId },
    });

    await this.commentNotificationLogsRepository.save(newLog);
  }

  getAllCommentNotificationLogs(): Promise<any[]> {
    const query = this.commentNotificationLogsRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.client', 'client')
      .leftJoinAndSelect('comment.set', 'set')
      .select([
        'comment.id',
        'comment.to',
        'comment.notificationDirection',
        'comment.content',
        'comment.unreadComments',
        'comment.needsAttentionComments',
        'comment.sendAt',
        'comment.sendAtTimestamp',

        'client.id',
        'client.firstName',
        'client.lastName',

        'set.id',
        'set.name',
      ])
      .orderBy('comment.id', 'DESC');

    return query.getMany();
  }
}
