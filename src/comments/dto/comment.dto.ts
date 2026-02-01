import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { TAuthorType } from '../types/authorType.type';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  comment: string;

  @IsString()
  @IsNotEmpty()
  authorName: string;

  @IsEnum(['client', 'user'])
  authorType: TAuthorType;

  @IsNumber()
  authorId: number;

  @IsNumber()
  @IsNotEmpty()
  positionId: number;

  @IsNumber()
  @IsNotEmpty()
  setId: number;
}

export class UpdateCommentDto {
  @IsString()
  @IsNotEmpty()
  comment: string;

  @IsString()
  @IsNotEmpty()
  authorName: string;

  @IsNotEmpty()
  @IsNumber()
  authorId: number;

  @IsNotEmpty()
  @IsNumber()
  commentId: number;
}
