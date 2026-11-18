import { User } from '../../user/user.entity';

export interface INotificationLogs {
  id: number;
  severity: string;
  message: string;
  details?: string;
  user: User;
  life: number;
  createdAt: string;
  createdAtTimestamp: number;
}
