export interface IEmail {
  to: string;
  subject: string;
  content: string;
  link: string;
  setId: number;
  sendBy: number;
  clientId?: number;
  supplierId?: number;
  sendAt: string;
  sendAtTimestamp: number;
}
