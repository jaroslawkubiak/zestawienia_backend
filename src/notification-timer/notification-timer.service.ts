import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationTimer } from './notification-timer.entity';

@Injectable()
export class NotificationTimerService {
  private clientTimers: Map<number, NodeJS.Timeout> = new Map();
  private userTimers: Map<number, NodeJS.Timeout> = new Map();
  private readonly TIMEOUT_DELAY =
    Number(process.env.COMMENTS_NOTIFICATION_DELAY) || 10000; // 10 min

  constructor(
    @InjectRepository(NotificationTimer)
    private readonly notificationTimerRepository: Repository<NotificationTimer>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async startNotificationTimer(
    setId: number,
    direction: 'client_to_office' | 'office_to_client',
    recipient: 'office' | 'client',
  ) {
    const delayMs = this.TIMEOUT_DELAY;
    const now = new Date();
    const fireAt = new Date(now.getTime() + delayMs);

    // 1. cancel previous timer
    await this.notificationTimerRepository.update(
      {
        setId: { id: setId } as any,
        direction,
        status: 'active',
      },
      {
        status: 'cancelled',
        cancelledAt: now,
      },
    );

    // 2. save new timer in DB
    let timerEntity = await this.notificationTimerRepository.findOne({
      where: { setId: { id: setId }, direction, status: 'cancelled' },
    });

    if (timerEntity) {
      // update as new
      timerEntity.status = 'active';
      timerEntity.startedAt = now;
      timerEntity.fireAt = fireAt;
      timerEntity.delayMs = delayMs;
      timerEntity.firedAt = null;
      timerEntity.cancelledAt = null;

      timerEntity = await this.notificationTimerRepository.save(timerEntity);
    } else {
      timerEntity = await this.notificationTimerRepository.save({
        setId: { id: setId } as any,
        direction,
        status: 'active',
        delayMs,
        startedAt: now,
        fireAt,
      });
    }

    // 3. start new timer
    const timeout = setTimeout(async () => {
      this.eventEmitter.emit('notification.timer.fired', {
        setId,
        recipient,
        direction,
      });

      await this.notificationTimerRepository.update(
        { id: timerEntity.id },
        {
          status: 'fired',
          firedAt: new Date(),
        },
      );

      this.clearRuntimeTimer(setId, direction);
    }, fireAt.getTime() - Date.now());

    this.setRuntimeTimer(setId, direction, timeout);
  }

  private setRuntimeTimer(
    setId: number,
    direction: 'client_to_office' | 'office_to_client',
    timer: NodeJS.Timeout,
  ) {
    const map =
      direction === 'client_to_office' ? this.clientTimers : this.userTimers;

    if (map.has(setId)) {
      clearTimeout(map.get(setId));
    }

    map.set(setId, timer);
  }

  private clearRuntimeTimer(
    setId: number,
    direction: 'client_to_office' | 'office_to_client',
  ) {
    const map =
      direction === 'client_to_office' ? this.clientTimers : this.userTimers;

    map.delete(setId);
  }
}
