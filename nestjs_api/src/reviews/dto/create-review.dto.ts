import { AutoMap } from "@automapper/classes";
import { IsInt, IsNotEmpty, IsPositive, Max, Min } from "class-validator";

export class CreateReviewDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(5)
  @AutoMap()
  grade: number;

  @IsNotEmpty()
  @AutoMap()
  comment: string;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @AutoMap()
  user: number;
}
