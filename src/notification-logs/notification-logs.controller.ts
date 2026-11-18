import { Body, Controller, Post } from '@nestjs/common';
import { NotificationLogDto } from './dto/notificationLog.dto';
import { NotificationLogsService } from './notification-logs.service';
import { INotificationLogs } from './types/INotificationLogs';

@Controller('notification-logs')
export class NotificationLogsController {
  constructor(private notificationLogsService: NotificationLogsService) {}

  @Post('addNotificationLog')
  addNotificationLog(
    @Body() createNotificationLogDto: NotificationLogDto,
  ): Promise<INotificationLogs> {
    return this.notificationLogsService.addNotificationLog(
      createNotificationLogDto,
    );
  }
}
