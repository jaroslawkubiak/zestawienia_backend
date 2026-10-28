export interface IPositionLogs {
  uploadId?: string | null;
  event?: string | null;
  positionId: number;
  userId?: number | null;
  setId?: number | null;
  image?: string | null;
  details?: Record<string, unknown> | null;
  createdAt?: string | null;
  createdAtTimestamp?: number | null;
  logs?: string | null;
}
