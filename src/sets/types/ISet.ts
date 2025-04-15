import { IFileList } from '../../files/types/IFileList';
import { IBookmark } from '../../bookmarks/types/IBookmark';
import { IComment } from '../../comments/types/IComment';

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
  files?: IFileList;
  comments?: IComment[];
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
