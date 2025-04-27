import { ISet } from '../../sets/types/ISet';

export interface IFileDetails {
  fileName: string;
  type: string;
  fullPath: string;
  dir: string;
  description: string;
  setId: ISet;
  size: number;
  createdAt?: string;
  createdAtTimestamp?: number;
}
