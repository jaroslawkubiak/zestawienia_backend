export interface IError {
  type: string;
  message: string;
  url: string;
  error: string;
  query?: string;
  parameters?: string;
  sql?: string;
  createdAt: string;
  createdAtTimestamp: number;
}
