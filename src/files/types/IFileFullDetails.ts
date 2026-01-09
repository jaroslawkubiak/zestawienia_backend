import { ISet } from '../../sets/types/ISet';

export interface IFileFullDetails {
  id: number;
  fileName: string;
  type: string;
  path: string;
  dir: string;
  originalName: string;
  setId: ISet;
  size: number;
  width: number;
  height: number;
  createdAt: string;
  createdAtTimestamp: number;
}
