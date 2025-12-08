import { ISet } from '../../sets/types/ISet';

export interface IClientLogs {
  success: boolean;
  req_setId: string;
  req_hash: string;
  client_name?: string;
  ip_address?: string | null;
  user_agent?: string | null;
  set?: ISet;
  date?: string;
  timestamp?: number;
}
