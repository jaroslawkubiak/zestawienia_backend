import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { SetVisibilityItemDto } from "./setVisibilityItem.dto";

export class SetVisibilityDto {
  @ValidateNested()
  @Type(() => SetVisibilityItemDto)
  bookmarks: SetVisibilityItemDto;

  @ValidateNested()
  @Type(() => SetVisibilityItemDto)
  files: SetVisibilityItemDto;

  @ValidateNested()
  @Type(() => SetVisibilityItemDto)
  comments: SetVisibilityItemDto;
}
