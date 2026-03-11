import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateClientDto {
  @IsString()
  @IsOptional()
  company?: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  avatar: string;

  @IsString()
  @IsOptional()
  telephone?: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  secondEmail?: string;

  @IsNumber()
  @IsOptional()
  setCount?: number;
}

export class UpdateClientDto {
  @IsString()
  @IsOptional()
  company?: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsString()
  @IsOptional()
  telephone?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  secondEmail?: string;

  @IsNumber()
  @IsOptional()
  setCount?: number;
}
