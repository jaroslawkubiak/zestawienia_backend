import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { UpdatePositionDto } from '../../position/dto/updatePosition.dto';
import { UpdateSetDto } from './updateSet.dto';

export class UpdateSetAndPositionDto {
  @ValidateNested({ each: true })
  @Type(() => UpdateSetDto)
  set: UpdateSetDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdatePositionDto)
  @ArrayNotEmpty()
  positions: UpdatePositionDto[];

  @IsNumber()
  userId: number;
}
