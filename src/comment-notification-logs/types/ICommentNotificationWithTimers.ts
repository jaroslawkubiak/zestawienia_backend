import { INotificationTimer } from '../../notification-timer/types/INotificationTimer';
import { ICommentNotificationLogs } from './ICommentNotificationLogs';

export interface ICommentNotificationWithTimers {
  commentNotification: ICommentNotificationLogs[];
  timers: INotificationTimer[];
}
