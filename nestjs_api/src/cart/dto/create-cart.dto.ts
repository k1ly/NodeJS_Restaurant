import { IsInt, IsNotEmpty, IsPositive } from "class-validator";

export class CreateCartDto {
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  quantity: number;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  dish: number;
}
