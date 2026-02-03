import { IsInt } from 'class-validator';

export class LastActiveUserBookmarkDto {
  @IsInt()
  id: number;
}
