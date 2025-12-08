import { ISet } from '../../sets/types/ISet';

export interface ISupplierLogs {
  success: boolean;
  req_setId: string;
  req_hash: string;
  req_supplier_hash: string;
  supplier_name?: string;
  ip_address?: string | null;
  user_agent?: string | null;
  set?: ISet;
  date?: string;
  timestamp?: number;
}
