import { IsNumber, IsOptional, IsString } from 'class-validator';

export class SendEmailDto {
  @IsString()
  to: string;

  @IsString()
  subject: string;

  @IsString()
  content: string;

  @IsNumber()
  setId: number;

  @IsNumber()
  userId: number;

  @IsOptional()
  @IsNumber()
  clientId?: number;

  @IsOptional()
  @IsNumber()
  supplierId?: number;

  @IsString()
  link: string;
}
