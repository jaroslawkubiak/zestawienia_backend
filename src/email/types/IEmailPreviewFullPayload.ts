import { IEmailPreviewPayload } from './IEmailPreviewPayload';

export interface IEmailPreviewFullPayload extends IEmailPreviewPayload {
  contentPartial: string | undefined;
  ASSETS_URL: string;
  socialColor: 'accent' | 'black';
  currentYear: number;
  GDPRClause: string;
}
