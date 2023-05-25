import { Injectable } from "@nestjs/common";
import { MappingProfile, Mapper, createMap } from "@automapper/core";
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { Category } from "./entities/category.entity";
import { CategoryDto } from "./dto/category.dto";
import { CreateCategoryDto } from "./dto/create-category.dto";

@Injectable()
export class CategoriesProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  get profile(): MappingProfile {
    return mapper => {
      createMap(mapper, Category, CategoryDto);
      createMap(mapper, CreateCategoryDto, Category);
    };
  }
}