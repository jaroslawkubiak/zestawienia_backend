export interface IFileFullDetails {
  id: number;
  fileName: string;
  thumbnail: string;
  type: string;
  seenAt: string | null;
  dir: string;
  originalName: string;
  path: string;
  setId: number;
  size: number;
  width: number;
  height: number;
  createdAt: string;
  createdAtTimestamp: number;
}
