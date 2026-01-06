import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { BookmarkDto } from '../../bookmarks/dto/bookmark.dto';
import { NewSetForPositionDto } from '../../sets/dto/NewSet.dto';
import { UpdateSupplierDto } from '../../suppliers/dto/supplier.dto';
import { CreateUserDto } from '../../user/dto/user.dto';

export class CreateClonePositionDto {
  @IsString()
  @IsOptional()
  produkt?: string;

  @IsString()
  @IsOptional()
  producent?: string;

  @IsString()
  @IsOptional()
  kolekcja?: string;

  @IsString()
  @IsOptional()
  nrKatalogowy?: string;

  @IsString()
  @IsOptional()
  kolor?: string;

  @IsNumber()
  @IsOptional()
  ilosc?: number;

  @IsNumber()
  @IsOptional()
  netto?: number;

  @IsNumber()
  @IsOptional()
  brutto?: number;

  @IsNumber()
  kolejnosc: number;

  @IsString()
  @IsOptional()
  pomieszczenie?: string;

  @IsString()
  @IsOptional()
  link?: string;

  @IsString()
  @IsOptional()
  uwagi?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateSupplierDto)
  supplierId?: UpdateSupplierDto | null;

  @ValidateNested({ each: true })
  @Type(() => BookmarkDto)
  bookmarkId: BookmarkDto;

  @ValidateNested({ each: true })
  @Type(() => CreateUserDto)
  createdBy: CreateUserDto;

  @ValidateNested({ each: true })
  @Type(() => CreateUserDto)
  updatedBy: CreateUserDto;

  @ValidateNested({ each: true })
  @Type(() => NewSetForPositionDto)
  setId: NewSetForPositionDto;
}
