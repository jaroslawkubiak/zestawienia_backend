import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationTimerModule } from '../notification-timer/notification-timer.module';
import { CommentNotificationLogsController } from './comment-notification-logs.controller';
import { CommentNotificationLogs } from './comment-notification-logs.entity';
import { CommentNotificationLogsService } from './comment-notification-logs.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentNotificationLogs]),
    NotificationTimerModule,
  ],
  controllers: [CommentNotificationLogsController],
  providers: [CommentNotificationLogsService],
  exports: [CommentNotificationLogsService],
})
export class CommentNotificationLogsModule {}
