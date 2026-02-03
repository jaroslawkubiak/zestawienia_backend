import { IsString, IsBoolean } from 'class-validator';

export class PositionStatusDto {
  @IsString()
  name: string;

  @IsString()
  label: string;

  @IsString()
  cssClass: string;

  @IsString()
  color: string;

  @IsBoolean()
  summary: boolean;
}
