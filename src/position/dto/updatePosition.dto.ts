import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { UpdateSupplierDto } from '../../suppliers/dto/supplier.dto';
import { PositionStatusDto } from './positionStatus.dto';

export class UpdatePositionDto {
  @IsNumber()
  id: number;

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
  image?: string;

  @ValidateNested()
  @Type(() => PositionStatusDto)
  status: PositionStatusDto;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateSupplierDto)
  supplierId?: UpdateSupplierDto | null;
}
