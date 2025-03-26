import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ErrorDto {
  @IsString()
  type: string;

  @IsString()
  message: string;

  @IsString()
  error: string;

  @IsOptional()
  @IsString()
  url?: string;

  @IsString()
  @IsOptional()
  query?: string;

  @IsString()
  @IsOptional()
  parameters?: string;

  @IsString()
  @IsOptional()
  sql?: string;

  @IsNumber()
  @IsOptional()
  setId?: number;

  @IsNumber()
  @IsOptional()
  recipientId?: number;

  @IsString()
  @IsOptional()
  recipientEmail?: string;

  @IsString()
  @IsOptional()
  link?: string;

  @IsString()
  createdAt: string;

  @IsNumber()
  createdAtTimestamp: number;
}
