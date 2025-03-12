import { IBookmark } from '../../bookmarks/IBookmark';

export interface INewSet {
  id: number;
  name: string;
  status: string;
  createdBy: number;
  createdAt: Date;
  createdAtTimestamp: Date;
  updatedBy: number;
  updatedAt: Date;
  updatedAtTimestamp: Date;
  clientId: number;
  bookmarks: IBookmark[];
  hash: string;
}
