import { IBookmark } from '../../bookmarks/IBookmark';

export interface INewSet {
  id: number;
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
