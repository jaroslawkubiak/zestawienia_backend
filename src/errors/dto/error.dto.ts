import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ErrorDto {
  @IsString()
  type: string;

  @IsString()
  message: string;

  @IsString()
  error: string;

  @IsString()
  @IsOptional()
  query: string;

  @IsString()
  @IsOptional()
  parameters: string;

  @IsString()
  @IsOptional()
  sql: string;

  @IsString()
  createdAt: string;

  @IsNumber()
  createdAtTimestamp: number;
}
