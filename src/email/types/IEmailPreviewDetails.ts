import { IClient } from '../../clients/types/IClient';
import { ISupplier } from '../../suppliers/types/ISupplier';
import { TEmailAudience } from './EmailAudience.type';
import { EmailTemplateName } from './EmailTemplateName.type';

export interface IEmailPreviewDetails {
  type: EmailTemplateName;
  setId: number;
  client: IClient;
  supplier?: ISupplier;
  audienceType: TEmailAudience;
}
