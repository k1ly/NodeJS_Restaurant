import { IsInt, IsNotEmpty, IsPositive } from "class-validator";
import { AutoMap } from "@automapper/classes";

export class UpdateCartDto {
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @AutoMap()
  quantity: number;
}
