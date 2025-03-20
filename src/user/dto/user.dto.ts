import { IsNumber, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
