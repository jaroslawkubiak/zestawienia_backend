import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ENotificationSeverity } from '../types/notification-severity.enum';

export class NotificationLogDto {
  @IsString()
  @IsNotEmpty()
  severity: ENotificationSeverity;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsOptional()
  details: string;

  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  @IsNotEmpty()
  life: number;
}
