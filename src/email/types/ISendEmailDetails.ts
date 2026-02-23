export interface ISendEmailDetails {
  to: string;
  subject: string;
  content: string;
  userId: number;
  setId: number;
  clientId?: number;
  supplierId?: number;
  link: string;
}
