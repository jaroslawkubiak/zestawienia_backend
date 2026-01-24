import { IBookmarksWithTableColumns } from '../../bookmarks/types/IBookmarksWithTableColumns';
import { User } from '../../user/user.entity';

export interface INewSet {
  id: number;
  name: string;
  address: string;
  status: string;
  createdBy: User;
  createdAt: string;
  createdAtTimestamp: number;
  updatedBy: User;
  updatedAt: string;
  updatedAtTimestamp: number;
  clientId: number;
  bookmarks: IBookmarksWithTableColumns[];
  hash: string;
}
