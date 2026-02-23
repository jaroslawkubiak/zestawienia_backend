import { TEmailAudience } from './EmailAudience.type';
import { EmailContextMap } from './IEmailContextMap';

export interface IEmailDetails<TAudience extends TEmailAudience> {
  audience: TAudience;
  templateName: string;
  HTMLHeader: string;
  emailSubject: (setName: string, createdAt: string) => string;
  message: (context: EmailContextMap[TAudience]) => string;
}
