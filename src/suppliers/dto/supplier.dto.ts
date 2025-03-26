import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSupplierDto {
  @IsString()
  @IsNotEmpty()
  firma: string;

  @IsString()
  @IsNotEmpty()
  imie: string;

  @IsString()
  @IsNotEmpty()
  nazwisko: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  telefon?: string;

  @IsString()
  @IsOptional()
  hash?: string;

  @IsNumber()
  @IsOptional()
  positionCount?: number;
}

export class UpdateSupplierDto {
  @IsNumber()
  @IsOptional()
  id?: number;

  @IsString()
  @IsOptional()
  firma?: string;

  @IsString()
  @IsOptional()
  imie?: string;

  @IsString()
  @IsOptional()
  nazwisko?: string;

  @IsString()
  @IsOptional()
  telefon?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  hash?: string;

  @IsNumber()
  @IsOptional()
  positionCount?: number;
}
