import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  comment: string;

  @IsEnum(['client', 'user'])
  authorType: 'client' | 'user';

  @IsNumber()
  authorId: number;

  @IsNumber()
  @IsNotEmpty()
  positionId: number;

  @IsNumber()
  @IsNotEmpty()
  setId: number;
}
