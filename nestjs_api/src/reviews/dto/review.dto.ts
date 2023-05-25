import { AutoMap } from "@automapper/classes";

export class ReviewDto {
  @AutoMap()
  id: number;

  @AutoMap()
  grade: number;

  @AutoMap()
  comment: string;

  @AutoMap()
  date: Date;

  @AutoMap()
  user: string;
}
