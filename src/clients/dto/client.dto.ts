import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateClientDto {
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
  telefon?: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsNumber()
  @IsOptional()
  setCount?: number;
}

export class UpdateClientDto {
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

  @IsNumber()
  @IsOptional()
  setCount?: number;
}
