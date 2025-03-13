import { Type } from 'class-transformer';
import { IsNumber, IsString, ValidateNested } from 'class-validator';

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

class BookmarkDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;
}
