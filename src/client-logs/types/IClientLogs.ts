import { ISet } from '../../sets/types/ISet';

export interface IClientLogs {
  success: boolean;
  req_setHash: string;
  req_clientHash: string;
  client_name?: string;
  ip_address?: string | null;
  user_agent?: string | null;
  set?: ISet;
  date?: string;
  timestamp?: number;
}
