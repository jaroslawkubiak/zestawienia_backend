import { IsNumber, IsString } from 'class-validator';

export class BookmarkWidthDto {
  @IsString()
  name: string;

  @IsNumber()
  width: number;
}
