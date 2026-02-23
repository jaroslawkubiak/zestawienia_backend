import { EmailTemplateName } from './EmailTemplateName.type';
import { IEmailDetails } from './IEmailDetails';

export type EmailTemplateMap = {
  [K in EmailTemplateName]: IEmailDetails<
    K extends `client${string}` ? 'client' : 'supplier'
  >;
};
