import { AutoMap } from "@automapper/classes";
import { IsInt, IsNotEmpty, IsOptional, IsPositive } from "class-validator";

export class ManagerUpdateOrderDto {
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @AutoMap()
  status: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @AutoMap()
  manager: number;
}
