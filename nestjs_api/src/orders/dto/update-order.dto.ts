import { AutoMap } from "@automapper/classes";
import { IsInt, IsNotEmpty, IsPositive } from "class-validator";

export class UpdateOrderDto {
  @IsNotEmpty()
  @AutoMap()
  specifiedDate: Date;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @AutoMap()
  address: number;
}
