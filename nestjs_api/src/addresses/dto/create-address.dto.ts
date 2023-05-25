import { AutoMap } from "@automapper/classes";
import { IsInt, IsNotEmpty, IsOptional, IsPositive } from "class-validator";

export class CreateAddressDto {
  @IsNotEmpty()
  @AutoMap()
  country: string;

  @IsNotEmpty()
  @AutoMap()
  locality: string;

  @IsOptional()
  @AutoMap()
  street: string;

  @IsNotEmpty()
  @AutoMap()
  house: string;

  @IsOptional()
  @AutoMap()
  apartment: string;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @AutoMap()
  user: number;
}
