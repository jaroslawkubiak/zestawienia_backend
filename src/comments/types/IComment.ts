import { TAuthorType } from './authorType.type';
import { IUnreadComments } from './IUnreadComments';

export interface IComment {
  id: number;
  comment: string;
  authorType: TAuthorType;
  authorId: number;
  authorName: string;
  seenAt: Date;
  needsAttention: boolean;
  createdAt: string;
  createdAtTimestamp: number;
  positionId: number | null;
  fileId: number | null;
  setId: number;
  newCommentsCount?: IUnreadComments;
}
