import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
  telefon: string;

  @IsString()
  @IsNotEmpty()
  email: string;
}

export class UpdateClientDto {
  @IsString()
  firma?: string;

  @IsString()
  imie?: string;

  @IsString()
  nazwisko?: string;

  @IsString()
  telefon?: string;

  @IsString()
  email?: string;
}
