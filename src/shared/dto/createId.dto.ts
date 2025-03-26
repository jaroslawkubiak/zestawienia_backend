import { IsNumber, IsNotEmpty } from "class-validator";

export class CreateIdDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
