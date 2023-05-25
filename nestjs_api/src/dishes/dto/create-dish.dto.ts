import { AutoMap } from "@automapper/classes";
import { IsInt, IsNotEmpty, IsOptional, IsPositive, Max, Min } from "class-validator";

export class CreateDishDto {
  @IsNotEmpty()
  @AutoMap()
  name: string;

  @IsNotEmpty()
  @AutoMap()
  description: string;

  @IsOptional()
  @AutoMap()
  imageUrl: string;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @AutoMap()
  weight: number;

  @IsNotEmpty()
  @Min(0)
  @AutoMap()
  price: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(100)
  @AutoMap()
  discount: number;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @AutoMap()
  category: number;
}
