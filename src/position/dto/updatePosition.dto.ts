import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { UpdateSupplierDto } from '../../suppliers/dto/supplier.dto';

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
  kolejnosc: number;

  @IsString()
  @IsOptional()
  pomieszczenie?: string;

  @IsString()
  @IsOptional()
  link?: string;

  @IsString()
  @IsOptional()
  image?: string;
  
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateSupplierDto)
  supplierId?: UpdateSupplierDto | null;
}
