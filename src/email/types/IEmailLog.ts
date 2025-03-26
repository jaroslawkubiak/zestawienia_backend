import { ISet } from '../../sets/types/ISet';
import { User } from '../../user/user.entity';

export interface IEmailLog {
  id: number;
  to: string;
  subject: string;
  content: any;
  link: string;
  setId: ISet;
  sendAt: string;
  sendAtTimestamp: number;
  sendBy: User;
}
