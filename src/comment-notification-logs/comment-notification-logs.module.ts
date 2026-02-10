import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentNotificationLogs } from './comment-notification-logs.entity';
import { CommentNotificationLogsService } from './comment-notification-logs.service';

@Module({
  imports: [TypeOrmModule.forFeature([CommentNotificationLogs])],
  providers: [CommentNotificationLogsService],
  exports: [CommentNotificationLogsService],
})
export class CommentNotificationLogsModule {}
