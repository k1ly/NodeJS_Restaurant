import { AutoMap } from "@automapper/classes";
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Length,
  Matches
} from "class-validator";
import { Match } from "../../util/validation/match.decorator";

export class CreateUserDto {
  @IsNotEmpty()
  @Length(4, 40)
  @Matches(/^[A-Za-z]\w*$/, {
    message: "Must start with a Latin character and be between 4 and 20 characters long"
  })
  @AutoMap()
  login: string;

  @IsNotEmpty()
  @Length(4, 40)
  @Matches(/^[a-zA-Z]+([\. '-][a-zA-Z]+)*$/, {
    message: "Must not contain numbers or special characters"
  })
  @AutoMap()
  name: string;

  @IsNotEmpty()
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}$/, {
    message: "Password is too weak. It should contain at least 1 digit, 1 lowercase letter, 1 uppercase letter and have from 8 to 16 length"
  })
  @AutoMap()
  password: string;

  @IsNotEmpty()
  @Match((userDto: CreateUserDto) => userDto.password, {
    message: "Passwords do not match"
  })
  matchingPassword: string;

  @IsOptional()
  @IsEmail()
  @AutoMap()
  email: string;

  @IsOptional()
  @Matches(/^((\+\d{1,3}( )?)?((\(\d{1,3}\))|\d{1,3})[- ]?\d{3,4}[- ]?\d{4})?/)
  @AutoMap()
  phone: string;
}
