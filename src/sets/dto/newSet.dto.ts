import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { BookmarkDto } from '../../bookmarks/dto/bookmark.dto';

export class NewSetDto {
  @IsString()
  name: string;

  @IsNumber()
  clientId: number;

  @IsNumber()
  createdBy: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BookmarkDto)
  @ArrayNotEmpty()
  bookmarks: BookmarkDto[];
}

export class NewSetForPositionDto {
  @IsNumber()
  id: number;
}
