import { IBookmark } from '../../bookmarks/types/IBookmark';

export interface ISet {
  id: number;
  name: string;
  status: string;
  createdAt: string;
  createdAtTimestamp: number;
  updatedAt: string;
  updatedAtTimestamp: number;
  hash: string;
  bookmarks: IBookmark[];
  files?: string[];
  clientId: {
    id: number;
    firma: string;
    email: string;
  };
  createdBy: {
    id: number;
    name: string;
  };
  updatedBy: {
    id: number;
    name: string;
  };
}
