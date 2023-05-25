import { Injectable } from "@nestjs/common";
import { MappingProfile, Mapper, createMap, forMember, mapFrom } from "@automapper/core";
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { Dish } from "./entities/dish.entity";
import { DishDto } from "./dto/dish.dto";
import { CreateDishDto } from "./dto/create-dish.dto";

@Injectable()
export class DishesProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  get profile(): MappingProfile {
    return mapper => {
      createMap(mapper, Dish, DishDto,
        forMember(dishDto => dishDto.category, mapFrom(dish => dish.category?.id)));
      createMap(mapper, CreateDishDto, Dish);
    };
  }
}