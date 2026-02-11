import { Type } from 'class-transformer';
import {
  IsDefined,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ENotificationDirection } from '../../notification-timer/types/notification-direction.enum';
import { CreateIdDto } from '../../shared/dto/createId.dto';

export class CommentNotificationDto {
  @IsString()
  to: string;

  @IsString()
  subject: string;

  @IsEnum(ENotificationDirection)
  notificationDirection: ENotificationDirection;

  @IsDefined()
  content: any;

  @IsNumber()
  unreadComments: number;

  @IsNumber()
  needsAttentionComments: number;

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
