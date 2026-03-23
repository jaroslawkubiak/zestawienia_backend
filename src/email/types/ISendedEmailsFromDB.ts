export interface ISendedEmailsFromDB {
  id: number;
  link: string;
  sendAt: string;
  sendAtTimestamp: number;
  content: string;
  subject: string;
  to: string;
  secondEmail?: string;
  client?: {
    id: number;
    company: string;
    firstName: string;
    lastName: string;
    email: string;
    secondEmail: string;
  };
  supplier?: {
    id: number;
    company: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  set: {
    id: number;
    name: string;
  };
  sendBy: {
    id: number;
    name: string;
  };
}
