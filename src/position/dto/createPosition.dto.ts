import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { UpdateSupplierDto } from '../../suppliers/dto/supplier.dto';
import { BookmarkDto } from 'src/bookmarks/dto/bookmark.dto';
import { CreateUserDto } from 'src/user/dto/user.dto';
import { NewSetForPositionDto } from 'src/sets/dto/NewSet.dto';

export class CreatePositionDto {
  @IsString()
  @IsOptional()
  produkt: string;

  @IsString()
  @IsOptional()
  producent: string;

  @IsString()
  @IsOptional()
  kolekcja: string;

  @IsString()
  @IsOptional()
  nrKatalogowy: string;

  @IsString()
  @IsOptional()
  kolor: string;

  @IsNumber()
  @IsOptional()
  ilosc: number;

  @IsNumber()
  @IsOptional()
  netto: number;

  @IsNumber()
  kolejnosc: number;

  @IsString()
  @IsOptional()
  pomieszczenie: string;

  @IsString()
  @IsOptional()
  link: string;

  @IsString()
  @IsOptional()
  image: string;

  @ValidateNested({ each: true })
  @Type(() => UpdateSupplierDto)
  supplierId: UpdateSupplierDto;

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
