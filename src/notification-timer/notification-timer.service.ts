import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationTimer } from './notification-timer.entity';
import { ENotificationDirection } from './types/notification-direction.enum';
import { INotificationTimer } from './types/INotificationTimer';

@Injectable()
export class NotificationTimerService {
  private clientTimers: Map<number, NodeJS.Timeout> = new Map();
  private userTimers: Map<number, NodeJS.Timeout> = new Map();
  private readonly TIMEOUT_DELAY =
    Number(process.env.COMMENTS_NOTIFICATION_DELAY) || 600000; // 10 * 60 * 1000 = 600000 = 10min

  constructor(
    @InjectRepository(NotificationTimer)
    private readonly notificationTimerRepository: Repository<NotificationTimer>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async startNotificationTimer(
    setId: number,
    notificationDirection: ENotificationDirection,
    recipient: 'office' | 'client',
  ) {
    const delayMs = this.TIMEOUT_DELAY;
    const now = new Date();
    const fireAt = new Date(now.getTime() + delayMs);

    // 1. cancel previous timer
    await this.notificationTimerRepository.update(
      {
        setId: { id: setId },
        notificationDirection,
        status: 'active',
      },
      {
        status: 'cancelled',
        cancelledAt: now,
      },
    );

    // 2. save new timer in DB
    let timerEntity = await this.notificationTimerRepository.findOne({
      where: {
        setId: { id: setId },
        notificationDirection,
        status: 'cancelled',
      },
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
        setId: { id: setId },
        notificationDirection,
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
        notificationDirection,
      });

      await this.notificationTimerRepository.update(
        { id: timerEntity.id },
        {
          status: 'fired',
          firedAt: new Date(),
        },
      );

      this.clearRuntimeTimer(setId, notificationDirection);
    }, fireAt.getTime() - Date.now());

    this.setRuntimeTimer(setId, notificationDirection, timeout);
  }

  private setRuntimeTimer(
    setId: number,
    notificationDirection: ENotificationDirection,
    timer: NodeJS.Timeout,
  ) {
    const map =
      notificationDirection === ENotificationDirection.CLIENT_TO_OFFICE
        ? this.clientTimers
        : this.userTimers;

    if (map.has(setId)) {
      clearTimeout(map.get(setId));
    }

    map.set(setId, timer);
  }

  private clearRuntimeTimer(
    setId: number,
    notificationDirection: ENotificationDirection,
  ) {
    const map =
      notificationDirection === ENotificationDirection.CLIENT_TO_OFFICE
        ? this.clientTimers
        : this.userTimers;

    map.delete(setId);
  }

  async getAllActiveTimers(): Promise<INotificationTimer[]> {
    const result = await this.notificationTimerRepository
      .createQueryBuilder('notification-timer')
      .leftJoinAndSelect('notification-timer.setId', 'set')
      .select([
        'notification-timer.id',
        'notification-timer.status',
        'notification-timer.notificationDirection',
        'notification-timer.delayMs',
        'notification-timer.startedAt',
        'notification-timer.fireAt',

        'set.id',
        'set.name',
      ])
      .where('notification-timer.status = :status', { status: 'active' })
      .orderBy('notification-timer.id', 'DESC')
      .getMany();

    return result.map((timer) => this.mapToType(timer));
  }

  private mapToType(notificationTimer: NotificationTimer): INotificationTimer {
    return {
      id: notificationTimer.id,
      status: notificationTimer.status,
      notificationDirection: notificationTimer.notificationDirection,
      delayMs: notificationTimer.delayMs,
      startedAt: notificationTimer.startedAt,
      fireAt: notificationTimer.fireAt,
      set: {
        id: notificationTimer.setId.id,
        name: notificationTimer.setId.name,
      },
    };
  }
}
