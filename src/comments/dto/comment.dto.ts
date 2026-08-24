import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
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
  @IsOptional()
  positionId: number | null;

  @IsNumber()
  @IsOptional()
  fileId: number | null;

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
