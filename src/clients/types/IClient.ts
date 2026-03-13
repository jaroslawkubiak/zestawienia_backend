import { IAvatarFullDetails } from '../../avatar/types/IAvatarFullDetails';

export interface IClient {
  id: number;
  company: string;
  firstName: string;
  lastName: string;
  avatar?: IAvatarFullDetails;
  email: string;
  secondEmail: string;
  hash: string;
  telephone?: string;
  setCount?: number;
}
