import { IBookmarksWithTableColumns } from '../../bookmarks/types/IBookmarksWithTableColumns';
import { IUnreadComments } from '../../comments/types/IUnreadComments';
import { ISupplier } from '../../suppliers/types/ISupplier';
import { IUser } from '../../user/types/IUser';
import { IPositionStatus } from './IPositionStatus';

export interface IPosition {
  id: number;
  produkt: string;
  producent: string;
  kolekcja: string;
  nrKatalogowy: string;
  kolor: string;
  ilosc: number;
  netto: number;
  brutto: number;
  kolejnosc: number;
  pomieszczenie: string;
  link: string;
  uwagi: string;
  image: string;
  status: IPositionStatus;
  newCommentsCount?: IUnreadComments;
  createdAt: string;
  createdAtTimestamp: number;
  updatedAt: string;
  updatedAtTimestamp: number;
  supplierId?: ISupplier;
  bookmarkId: IBookmarksWithTableColumns;
  createdBy: IUser;
  updatedBy: IUser;
}
