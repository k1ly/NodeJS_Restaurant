import { AutoMap } from "@automapper/classes";

export class AddressDto {
  @AutoMap()
  id: number;

  @AutoMap()
  country: string;

  @AutoMap()
  locality: string;

  @AutoMap()
  street: string;

  @AutoMap()
  house: string;

  @AutoMap()
  apartment: string;

  @AutoMap()
  user:number;
}
