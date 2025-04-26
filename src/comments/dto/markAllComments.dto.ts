import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class IMarkAllComments {
  @IsNumber()
  @IsNotEmpty()
  positionId: number;

  @IsBoolean()
  @IsNotEmpty()
  readState: boolean;

  @IsString()
  @IsNotEmpty()
  authorType: string;
}
