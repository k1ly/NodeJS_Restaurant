import { AutoMap } from "@automapper/classes";

export class StatusDto {
  @AutoMap()
  id: number;

  @AutoMap()
  name: string;
}
