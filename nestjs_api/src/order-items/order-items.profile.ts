import { Injectable } from "@nestjs/common";
import { MappingProfile, Mapper, createMap, forMember, mapFrom } from "@automapper/core";
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { CreateOrderItemDto } from "./dto/create-order-item.dto";
import { OrderItem } from "./entities/order-item.entity";
import { OrderItemDto } from "./dto/order-item.dto";
import { UpdateOrderItemDto } from "./dto/update-order-item.dto";

@Injectable()
export class OrderItemsProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  get profile(): MappingProfile {
    return mapper => {
      createMap(mapper, OrderItem, OrderItemDto,
        forMember(orderItemDto => orderItemDto.dish, mapFrom(orderItem => orderItem.dish?.id)),
        forMember(orderItemDto => orderItemDto.order, mapFrom(orderItem => orderItem.order?.id)));
      createMap(mapper, CreateOrderItemDto, OrderItem);
      createMap(mapper, UpdateOrderItemDto, OrderItem);
    };
  }
}