export interface IError {
  id: number;
  type: string;
  message: string;
  error: string;
  query?: string;
  parameters?: string;
  sql?: string;
  createdAt: string;
  createdAtTimestamp: number;
}
