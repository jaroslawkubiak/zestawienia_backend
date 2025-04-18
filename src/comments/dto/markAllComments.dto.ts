import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';

export class IMarkAllComments {
  @IsNumber()
  @IsNotEmpty()
  positionId: number;

  @IsBoolean()
  @IsNotEmpty()
  readState: boolean;
}
