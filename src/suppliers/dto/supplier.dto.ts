import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
  @IsOptional()
  telefon: string;

  @IsString()
  @IsOptional()
  email: string;
}

export class UpdateSupplierDto {
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
}
