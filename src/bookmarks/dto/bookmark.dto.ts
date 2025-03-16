import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { BookmarkWidthDto } from './bookmarkWidth.dto';

export class BookmarkDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BookmarkWidthDto)
  width: BookmarkWidthDto[];
}
