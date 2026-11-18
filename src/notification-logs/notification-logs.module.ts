import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationLogsController } from './notification-logs.controller';
import { NotificationLogs } from './notification-logs.entity';
import { NotificationLogsService } from './notification-logs.service';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationLogs])],
  controllers: [NotificationLogsController],
  providers: [NotificationLogsService],
  exports: [NotificationLogsService],
})
export class NotificationLogsModule {}
