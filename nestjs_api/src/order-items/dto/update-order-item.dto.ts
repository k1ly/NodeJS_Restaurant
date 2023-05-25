import { AutoMap } from "@automapper/classes";
import { IsInt, IsNotEmpty, IsPositive } from "class-validator";

export class UpdateOrderItemDto {
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @AutoMap()
  quantity: number;
}
