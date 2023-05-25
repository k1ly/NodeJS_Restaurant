import { AutoMap } from "@automapper/classes";
import { IsNotEmpty } from "class-validator";

export class CreateCategoryDto {
  @IsNotEmpty()
  @AutoMap()
  name: string;
}
