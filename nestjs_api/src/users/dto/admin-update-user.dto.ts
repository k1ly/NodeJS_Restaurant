import { AutoMap } from "@automapper/classes";
import { IsBoolean, IsInt, IsNotEmpty, IsPositive } from "class-validator";

export class AdminUpdateUserDto {
  @IsNotEmpty()
  @IsBoolean()
  @AutoMap()
  blocked: boolean;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @AutoMap()
  role: number;
}
