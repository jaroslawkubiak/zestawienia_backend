import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CommentNotificationLogsService } from './comment-notification-logs.service';
import { ICommentNotificationWithTimers } from './types/ICommentNotificationWithTimers';

@UseGuards(JwtAuthGuard)
@Controller('comment-notification')
export class CommentNotificationLogsController {
  constructor(
    private readonly commentNotificationLogsService: CommentNotificationLogsService,
  ) {}

  @Get('getAllCommentNotificationLogs')
  getAllCommentNotificationLogs(): Promise<ICommentNotificationWithTimers> {
    return this.commentNotificationLogsService.getAllCommentNotificationLogs();
  }
}
