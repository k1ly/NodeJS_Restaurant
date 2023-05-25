import { AutoMap } from "@automapper/classes";

export class DishDto {
  @AutoMap()
  id: number;

  @AutoMap()
  name: string;

  @AutoMap()
  description: string;

  @AutoMap()
  imageUrl: string;

  @AutoMap()
  weight: number;

  @AutoMap()
  price: number;

  @AutoMap()
  discount: number;

  @AutoMap()
  category: number;
}
