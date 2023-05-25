import { AutoMap } from "@automapper/classes";
import { IsNotEmpty } from "class-validator";

export class CreateRoleDto {
  @IsNotEmpty()
  @AutoMap()
  name: string;
}
