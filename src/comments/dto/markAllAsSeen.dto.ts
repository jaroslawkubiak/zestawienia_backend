import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class IMarkAllAsSeen {
  @IsNumber()
  @IsNotEmpty()
  positionId: number;

  @IsString()
  @IsNotEmpty()
  authorType: string;
}
