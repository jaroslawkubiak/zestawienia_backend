import { IEmailClientDetails } from './IEmailClientDetails';

export interface EmailContextMap {
  client: { linkToSet?: string };
  supplier: {
    linkToSet?: string;
    client?: IEmailClientDetails;
  };
}
