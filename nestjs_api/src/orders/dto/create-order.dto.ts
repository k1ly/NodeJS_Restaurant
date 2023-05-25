import { AutoMap } from "@automapper/classes";
import { IsInt, IsNotEmpty, IsPositive } from "class-validator";

export class CreateOrderDto {
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @AutoMap()
  customer: number;
}
