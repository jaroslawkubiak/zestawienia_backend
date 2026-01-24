import { IsInt } from 'class-validator';

export class LastBookmarkDto {
  @IsInt()
  id: number;
}
