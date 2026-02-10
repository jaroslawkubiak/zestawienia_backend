import { Type } from 'class-transformer';
import {
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateIdDto } from '../../shared/dto/createId.dto';

export class CommentNotificationDto {
  @IsString()
  to: string;
  @IsString()
  subject: string;
  @IsDefined()
  content: any;
  @IsNumber()
  unreadComments: number;
  @IsString()
  sendAt: string;
  @IsNumber()
  sendAtTimestamp: number;

  @ValidateNested({ each: true })
  @Type(() => CreateIdDto)
  setId: CreateIdDto;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateIdDto)
  clientId?: CreateIdDto | null;
}
