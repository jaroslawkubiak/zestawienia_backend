import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class IMarkAllAsSeen {
  @IsNumber()
  @IsOptional()
  positionId: number;

  @IsNumber()
  @IsOptional()
  fileId: number;

  @IsString()
  @IsNotEmpty()
  authorType: string;
}
