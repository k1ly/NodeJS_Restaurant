import { AutoMap } from "@automapper/classes";
import { IsNotEmpty } from "class-validator";

export class UpdateAddressDto {
  @IsNotEmpty()
  @AutoMap()
  country: string;

  @IsNotEmpty()
  @AutoMap()
  locality: string;

  @IsNotEmpty()
  @AutoMap()
  street: string;

  @IsNotEmpty()
  @AutoMap()
  house: string;

  @IsNotEmpty()
  @AutoMap()
  apartment: string;
}
