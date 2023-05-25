import { AutoMap } from "@automapper/classes";

export class OrderDto {
  @AutoMap()
  id: number;

  @AutoMap()
  price: number;

  @AutoMap()
  specifiedDate: Date;

  @AutoMap()
  orderDate: Date;

  @AutoMap()
  deliveryDate: Date;

  @AutoMap()
  address: number;

  @AutoMap()
  status: string;

  @AutoMap()
  customer: number;

  @AutoMap()
  manager: number;
}
