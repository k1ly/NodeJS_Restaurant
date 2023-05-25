import { AutoMap } from "@automapper/classes";
import { IsInt, IsNotEmpty, Max, Min } from "class-validator";

export class UpdateReviewDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(5)
  @AutoMap()
  grade: number;

  @IsNotEmpty()
  @AutoMap()
  comment: string;
}
