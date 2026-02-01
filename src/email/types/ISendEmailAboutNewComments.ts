import { TAuthorType } from '../../comments/types/authorType.type';
import { IComment } from '../../comments/types/IComment';

export interface ISendEmailAboutNewComments {
  setId: number;
  newComments: IComment[];
  headerText: string;
  link: string;
  recipient: string;
  commentAuthorType: TAuthorType;
}
