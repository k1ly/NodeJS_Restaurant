import { AutoMap } from "@automapper/classes";

export class OrderItemDto {
  @AutoMap()
  id: number;

  @AutoMap()
  quantity: number;

  @AutoMap()
  dish: number;

  @AutoMap()
  order: number;
}
