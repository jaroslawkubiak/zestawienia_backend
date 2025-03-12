import { User } from "src/user/user.entity";

export interface IPosition {
  id: number;
  produkt: string;
  producent: string;
  kolekcja: string;
  nrKatalogowy: string;
  kolor: string;
  ilosc: number;
  netto: number;
  kolejnosc: number;
  pomieszczenie: string;
  link: string;
  image: string;
  acceptedAt: Date;
  acceptedAtTimestamp: Date;
  createdBy: User;
  createdAt: Date;
  createdAtTimestamp: Date;
  updatedBy: User;
  updatedAt: Date;
  updatedAtTimestamp: Date;
}
