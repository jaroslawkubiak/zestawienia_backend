import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { minifyHtml } from '../helpers/minifyHtml';
import { NotificationTimerService } from '../notification-timer/notification-timer.service';
import { CommentNotificationLogs } from './comment-notification-logs.entity';
import { CommentNotificationDto } from './types/commentNotification.dto';
import { ICommentNotificationLogs } from './types/ICommentNotificationLogs';
import { ICommentNotificationWithTimers } from './types/ICommentNotificationWithTimers';

@Injectable()
export class CommentNotificationLogsService {
  constructor(
    @InjectRepository(CommentNotificationLogs)
    private readonly commentNotificationLogsRepository: Repository<CommentNotificationLogs>,
    private notificationTimerService: NotificationTimerService,
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

  async getAllCommentNotificationLogs(): Promise<ICommentNotificationWithTimers> {
    const result = await this.commentNotificationLogsRepository
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
      .orderBy('comment.id', 'DESC')
      .getMany();

    const commentNotification = result.map((commentLog) =>
      this.mapToType(commentLog),
    );

    const timers = await this.notificationTimerService.getAllActiveTimers();

    return {
      commentNotification,
      timers,
    };
  }

  private mapToType(
    commentLog: CommentNotificationLogs,
  ): ICommentNotificationLogs {
    return {
      id: commentLog.id,
      to: commentLog.to,
      notificationDirection: commentLog.notificationDirection,
      content: commentLog.content,
      unreadComments: commentLog.unreadComments,
      needsAttentionComments: commentLog.needsAttentionComments,
      sendAt: commentLog.sendAt,
      sendAtTimestamp: commentLog.sendAtTimestamp,
      set: {
        id: commentLog.set.id,
        name: commentLog.set.name,
      },
      client: {
        id: commentLog.client.id,
        firstName: commentLog.client.firstName,
        lastName: commentLog.client.lastName,
      },
    };
  }
}
