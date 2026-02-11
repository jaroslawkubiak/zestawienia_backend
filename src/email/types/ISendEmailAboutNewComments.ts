import { TAuthorType } from '../../comments/types/authorType.type';
import { IComment } from '../../comments/types/IComment';

export interface ISendEmailAboutNewComments {
  setId: number;
  newComments: IComment[];
  needsAttentionComments: IComment[];
  headerText: string;
  recipient: string;
  commentAuthorType: TAuthorType;
}
