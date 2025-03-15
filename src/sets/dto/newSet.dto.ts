import { Type } from 'class-transformer';
import { IsNumber, IsString, ValidateNested } from 'class-validator';
import { BookmarkDto } from './bookmark.dto';

export class NewSetDto {
  @IsString()
  name: string;

  @IsNumber()
  clientId: number;

  @IsNumber()
  createdBy: number;

  @ValidateNested()
  @Type(() => BookmarkDto)
  bookmarks: BookmarkDto[];
}
