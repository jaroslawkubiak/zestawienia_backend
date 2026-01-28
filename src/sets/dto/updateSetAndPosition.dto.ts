import { Type } from 'class-transformer';
import { IsArray, IsDefined, IsNumber, ValidateNested } from 'class-validator';
import { UpdatePositionDto } from '../../position/dto/updatePosition.dto';
import { UpdateSetDto } from './updateSet.dto';

export class UpdateSetAndPositionDto {
  @ValidateNested()
  @Type(() => UpdateSetDto)
  set: UpdateSetDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdatePositionDto)
  positions: UpdatePositionDto[];

  @IsDefined()
  @IsNumber()
  userId: number;

  @IsArray()
  positionToDelete: number[];
}
