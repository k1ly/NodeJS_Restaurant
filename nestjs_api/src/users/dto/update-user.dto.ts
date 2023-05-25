import { AutoMap } from "@automapper/classes";
import { IsEmail, IsNotEmpty, IsOptional, Length, Matches } from "class-validator";

export class UpdateUserDto {
  @IsNotEmpty()
  @Length(4, 40)
  @Matches(/^[a-zA-Z]+([\. '-][a-zA-Z]+)*$/)
  @AutoMap()
  name: string;

  @IsOptional()
  @IsEmail()
  @AutoMap()
  email: string;

  @IsOptional()
  @Matches(/^((\+\d{1,3}( )?)?((\(\d{1,3}\))|\d{1,3})[- ]?\d{3,4}[- ]?\d{4})?/)
  @AutoMap()
  phone: string;
}
