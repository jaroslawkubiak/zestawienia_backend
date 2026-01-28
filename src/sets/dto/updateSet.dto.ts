import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsDefined,
  IsString,
  ValidateNested,
} from 'class-validator';
import { BookmarkDto } from '../../bookmarks/dto/bookmark.dto';
import { LastBookmarkDto } from './lastBookmark.dto';

export class UpdateSetDto {
  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsDefined()
  @ValidateNested()
  @Type(() => LastBookmarkDto)
  lastBookmark: LastBookmarkDto;

  @IsDefined()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BookmarkDto)
  @ArrayNotEmpty()
  bookmarks: BookmarkDto[];

  @IsString()
  status: string;
}
