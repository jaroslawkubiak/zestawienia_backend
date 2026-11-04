import { IsBoolean, IsString } from "class-validator";

export class SetVisibilityItemDto {
  @IsBoolean()
  visible: boolean;

  @IsString()
  label: string;
}