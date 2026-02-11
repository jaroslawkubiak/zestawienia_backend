import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CommentNotificationLogsService } from './comment-notification-logs.service';
import { ICommentNotificationLogs } from './types/ICommentNotificationLogs';

@UseGuards(JwtAuthGuard)
@Controller('comment-notification')
export class CommentNotificationLogsController {
  constructor(
    private readonly commentNotificationLogsService: CommentNotificationLogsService,
  ) {}

  @Get('getAllCommentNotificationLogs')
  getAllCommentNotificationLogs(): Promise<ICommentNotificationLogs[]> {
    return this.commentNotificationLogsService.getAllCommentNotificationLogs();
  }
}
