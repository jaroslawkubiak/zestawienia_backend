import { IBookmark } from '../../bookmarks/IBookmark';

export interface INewSet {
  numer: string;
  clientId: number;
  bookmarks: IBookmark[];
  status: string;
  createDate: string;
  createTimeStamp: string;
  updateDate: string;
  updateTimeStamp: string;
  hash: string;
  createdBy: number;
  updatedBy: number;
}
