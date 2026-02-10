import { Module } from '@nestjs/common';
import { NotificationTimerService } from './notification-timer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationTimer } from './notification-timer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationTimer])],
  providers: [NotificationTimerService],
  exports: [NotificationTimerService],
})
export class NotificationTimerModule {}
