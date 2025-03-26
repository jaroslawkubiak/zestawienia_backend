export interface IError {
  type: string;
  message: string;
  error: string;
  url?: string;
  query?: string;
  parameters?: string;
  sql?: string;
  setId?: number;
  recipientId?: number;
  recipientEmail?: string;
  link?: string;
  createdAt: string;
  createdAtTimestamp: number;
}
