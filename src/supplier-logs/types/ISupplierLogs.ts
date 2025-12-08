import { IClient } from '../../clients/types/IClient';
import { ISet } from '../../sets/types/ISet';
import { ISupplier } from '../../suppliers/types/ISupplier';

export interface ISupplierLogs {
  success: boolean;
  req_setHash: string;
  req_supplierHash: string;
  client_name?: string;
  supplier_name?: string;
  ip_address?: string | null;
  user_agent?: string | null;
  set?: ISet;
  supplier?: ISupplier;
  client?: IClient;
  date?: string;
  timestamp?: number;
}
