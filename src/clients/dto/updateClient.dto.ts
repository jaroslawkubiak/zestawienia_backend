import { IsOptional, IsString } from 'class-validator';
import { IAvatarFullDetails } from '../../avatar/types/IAvatarFullDetails';

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

  @IsOptional()
  avatar?: IAvatarFullDetails;

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
