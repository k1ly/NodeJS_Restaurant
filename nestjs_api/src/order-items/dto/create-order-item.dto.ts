import { AutoMap } from "@automapper/classes";
import { IsInt, IsNotEmpty, IsPositive } from "class-validator";

export class CreateOrderItemDto {
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @AutoMap()
  quantity: number;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @AutoMap()
  dish: number;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @AutoMap()
  order: number;
}
