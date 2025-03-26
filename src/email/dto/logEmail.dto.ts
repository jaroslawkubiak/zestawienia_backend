import { Type } from 'class-transformer';
import {
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateIdDto } from '../../shared/dto/createId.dto';

export class LogEmailDto {
  @IsString()
  to: string;
  @IsString()
  subject: string;
  @IsDefined()
  content: any;
  @IsString()
  link: string;
  @IsString()
  sendAt: string;
  @IsNumber()
  sendAtTimestamp: number;

  @ValidateNested({ each: true })
  @Type(() => CreateIdDto)
  sendBy: CreateIdDto;

  @ValidateNested({ each: true })
  @Type(() => CreateIdDto)
  setId: CreateIdDto;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateIdDto)
  clientId?: CreateIdDto | null;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateIdDto)
  supplierId?: CreateIdDto | null;
}
