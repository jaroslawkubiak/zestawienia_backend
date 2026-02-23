import { IClientLight } from '../../clients/types/IClientLight';
import { ENotificationDirection } from '../../notification-timer/types/notification-direction.enum';
import { ISetLight } from '../../sets/types/ISetLight';

export interface ICommentNotificationLogs {
  id: number;
  to: string;
  notificationDirection: ENotificationDirection;
  content: string;
  unreadComments: number;
  needsAttentionComments: number;
  sendAt: string;
  sendAtTimestamp: number;
  set: ISetLight;
  client: IClientLight;
}
