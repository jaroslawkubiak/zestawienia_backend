
export interface IFileDetails {
  fileName: string;
  type: string;
  path: string;
  dir: string;
  originalName: string;
  setId: number;
  size: number;
  width: number;
  height: number;
  createdAt?: string;
  createdAtTimestamp?: number;
}
