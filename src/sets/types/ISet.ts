import { IBookmark } from '../../bookmarks/IBookmark';

export interface ISet {
  id: number;
  name: string;
  status: string;
  createdAt: Date;
  createdAtTimestamp: Date;
  updatedAt: Date;
  updatedAtTimestamp: Date;
  hash: string;
  bookmarks: IBookmark[];
  clientId: {
    firma: string;
    email: string;
  };
  createdBy: {
    name: string;
  };
  updatedBy: {
    name: string;
  };
}
