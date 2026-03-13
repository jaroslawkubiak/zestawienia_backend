import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IAvatarFullDetails } from '../../avatar/types/IAvatarFullDetails';

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

  @IsNotEmpty()
  avatar: IAvatarFullDetails;

  @IsString()
  @IsOptional()
  telephone?: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  secondEmail?: string;
}
