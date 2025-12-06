import { User } from 'src/user/user.entity';

export interface IUserLogin {
  id: number;
  login: string;
  success: number;
  reason: string;
  token: string;
  ipAddess: string;
  userAgent: string;
  loginAt: string;
  logoutAt: string;
  user: User;
}
