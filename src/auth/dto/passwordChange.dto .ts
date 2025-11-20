import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class PasswordChange {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsString()
  currentPassword: string;

  @IsString()
  newPassword: string;
}
