import { TEmailAudience } from './EmailAudience.type';

export interface IEmailTemplateList {
  templateName: string;
  audience: TEmailAudience;
  HTMLHeader: string;
}
