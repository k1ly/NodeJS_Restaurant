import { AutoMap } from "@automapper/classes";
import { IsNotEmpty } from "class-validator";

export class CreateStatusDto {
  @IsNotEmpty()
  @AutoMap()
  name: string;
}
