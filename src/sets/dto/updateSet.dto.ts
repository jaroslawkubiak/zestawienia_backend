import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
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

  @ValidateNested()
  @Type(() => LastBookmarkDto)
  lastBookmark: LastBookmarkDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BookmarkDto)
  @ArrayNotEmpty()
  bookmarks: BookmarkDto[];

  @IsString()
  status: string;
}
