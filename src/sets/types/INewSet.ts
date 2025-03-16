import { User } from '../../user/user.entity';
import { IBookmark } from '../../bookmarks/types/IBookmark';

export interface INewSet {
  id: number;
  name: string;
  status: string;
  createdBy: User;
  createdAt: string;
  createdAtTimestamp: number;
  updatedBy: User;
  updatedAt: string;
  updatedAtTimestamp: number;
  clientId: number;
  bookmarks: IBookmark[];
  hash: string;
}
