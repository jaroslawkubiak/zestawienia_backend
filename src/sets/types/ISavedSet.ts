import { Bookmark } from '../../bookmarks/bookmarks.entity';
import { IBookmarksWithTableColumns } from '../../bookmarks/types/IBookmarksWithTableColumns';

export interface ISavedSet {
  id: number;
  name: string;
  address: string;
  clientId: number;
  bookmarks: IBookmarksWithTableColumns[];
  lastBookmark: Bookmark;
  lastUsedClientBookmark: number;
  hash: string;
  status: string;
  createdAt: string;
  createdAtTimestamp: number;
  updatedAt: string;
  updatedAtTimestamp: number;
}
