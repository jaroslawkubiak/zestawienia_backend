import { IBookmark } from '../../bookmarks/types/IBookmark';

export interface ISavedSet {
  id: number;
  name: string;
  address: string;
  clientId: number;
  bookmarks: IBookmark[];
  hash: string;
  status: string;
  createdAt: string;
  createdAtTimestamp: number;
  updatedAt: string;
  updatedAtTimestamp: number;
}
