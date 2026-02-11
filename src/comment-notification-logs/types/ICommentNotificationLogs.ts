import { IClient } from '../../clients/types/IClient';
import { ENotificationDirection } from '../../notification-timer/types/notification-direction.enum';
import { ISet } from '../../sets/types/ISet';

export interface ICommentNotificationLogs {
  id: number;
  to: string;
  notificationDirection: ENotificationDirection;
  content: string;
  unreadComments: number;
  needsAttentionComments: number;
  sendAt: string;
  sendAtTimestamp: number;
  setId: ISet;
  clientId: IClient;
}
