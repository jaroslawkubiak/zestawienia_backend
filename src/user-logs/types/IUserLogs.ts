import { User } from '../../user/user.entity';

export interface IUserLogs {
  user: User;
  login: string;
  success: boolean;
  reject_reason: string;
  token: string;
  ip_address: string;
  user_agent: string;
  login_at: string;
  login_at_timestamp: number;
  logout_at?: string;
  logout_at_timestamp?: number;
}
