import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationTimer } from './notification-timer.entity';
import { NotificationTimerService } from './notification-timer.service';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationTimer])],
  providers: [NotificationTimerService],
  exports: [NotificationTimerService],
})
export class NotificationTimerModule {}
