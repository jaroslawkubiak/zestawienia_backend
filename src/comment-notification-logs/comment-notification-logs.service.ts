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

  async saveLog(commentNotificationDto: CommentNotificationDto): Promise<void> {
    // clean html content - leave only inside <body>, remove tabs, new lines
    const bodyOnly = this.extractBodyContent(commentNotificationDto.content);
    const cleanedHtmlContent = this.minifyHtml(bodyOnly);

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

  private extractBodyContent(html: string): string {
    if (!html) return html;

    const match = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    return match ? match[1].trim() : html;
  }

  private minifyHtml(html: string): string {
    return html
      .replace(/\t+/g, '')
      .replace(/\n+/g, '')
      .replace(/\r+/g, '')
      .replace(/>\s+</g, '><')
      .trim();
  }
}
