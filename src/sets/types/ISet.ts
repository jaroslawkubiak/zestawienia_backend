export interface ISet {
  id: number;
  numer: string;
  status: string;
  createDate: string;
  createTimeStamp: string;
  updateDate: string;
  updateTimeStamp: string;
  hash: string;
  bookmarks: IBookmarks;
  client: {
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

interface IBookmarks {
  id: number;
  nazwa: string;
}
