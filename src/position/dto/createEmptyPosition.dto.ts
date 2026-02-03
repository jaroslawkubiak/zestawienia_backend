import { Type } from 'class-transformer';
import { IsNumber, ValidateNested } from 'class-validator';
import { BookmarkDto } from '../../bookmarks/dto/bookmark.dto';
import { NewSetForPositionDto } from '../../sets/dto/NewSet.dto';
import { CreateUserDto } from '../../user/dto/user.dto';
import { PositionStatusDto } from './positionStatus.dto';

export class CreateEmptyPositionDto {
  @IsNumber()
  kolejnosc: number;

  @ValidateNested({ each: true })
  @Type(() => BookmarkDto)
  bookmarkId: BookmarkDto;

  @ValidateNested()
  @Type(() => PositionStatusDto)
  status: PositionStatusDto;

  @ValidateNested({ each: true })
  @Type(() => CreateUserDto)
  createdBy: CreateUserDto;

  @ValidateNested({ each: true })
  @Type(() => CreateUserDto)
  updatedBy: CreateUserDto;

  @ValidateNested({ each: true })
  @Type(() => NewSetForPositionDto)
  setId: NewSetForPositionDto;
}
