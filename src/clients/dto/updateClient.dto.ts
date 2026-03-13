import { IsString, IsOptional, IsNumber } from 'class-validator';

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

  @IsNumber()
  @IsOptional()
  avatarId?: number;

  @IsString()
  @IsOptional()
  telephone?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  secondEmail?: string;
}
