import { IsBoolean, IsString, IsNotEmpty } from 'class-validator';

export class SetVisibilityItemDto {
  @IsString()
  @IsNotEmpty()
  property: string;

  @IsBoolean()
  visible: boolean;

  @IsString()
  label: string;
}
