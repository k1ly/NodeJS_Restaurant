import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  ForbiddenException,
  NotFoundException,
  Put,
  UseInterceptors,
  UploadedFiles
} from "@nestjs/common";
import { DishesService } from "./dishes.service";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { AbilityService } from "../auth/ability/ability.service";
import { Auth } from "../auth/auth.decorator";
import { UserDto } from "../users/dto/user.dto";
import { AbilityAction } from "../auth/ability/ability.action";
import { Dish } from "./entities/dish.entity";
import { DishDto } from "./dto/dish.dto";
import { CreateDishDto } from "./dto/create-dish.dto";
import { Pagination } from "../util/pagination/pagination.decorator";
import { Pageable } from "../util/pagination/pagination.pageable";
import { FilesInterceptor } from "@nestjs/platform-express";
import { join } from "path";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("dishes")
@Controller("api/dishes")
export class DishesController {
  constructor(@InjectMapper() private readonly mapper: Mapper,
              private readonly dishesService: DishesService,
              private readonly abilityService: AbilityService) {
  }

  @Get()
  async findAll(@Query("category") category: number,
                @Query("filter") filter: string,
                @Pagination() pageable: Pageable,
                @Auth() auth: UserDto) {
    let [dishes, total] = category ? await this.dishesService.findByCategory(category, pageable) :
      (filter ? await this.dishesService.findByFilter(filter, pageable) : await this.dishesService.findAll(pageable));
    if (dishes.some(dish => !this.abilityService.authorize(auth, AbilityAction.Read, dish)))
      throw new ForbiddenException();
    return {
      content: this.mapper.mapArray(dishes, Dish, DishDto),
      total: Math.ceil(total / pageable.size),
      pageable
    };
  }

  @Get(":id")
  async findById(@Param("id") id: number, @Auth() auth: UserDto) {
    let dish = await this.dishesService.findById(id);
    if (!dish)
      throw new NotFoundException(`Dish with id "${id}" doesn't exist!`);
    if (!this.abilityService.authorize(auth, AbilityAction.Read, dish))
      throw new ForbiddenException();
    return this.mapper.map(dish, Dish, DishDto);
  }

  @Post()
  async create(@Body() createDishDto: CreateDishDto, @Auth() auth: UserDto) {
    if (!this.abilityService.authorize(auth, AbilityAction.Create, Dish))
      throw new ForbiddenException();
    await this.dishesService.create(createDishDto);
  }

  @Post("save")
  @UseInterceptors(FilesInterceptor("image"))
  async upload(@UploadedFiles() files: Express.Multer.File, @Auth() auth: UserDto) {
    if (!this.abilityService.authorize(auth, AbilityAction.Create, Dish))
      throw new ForbiddenException();
    return join("dishes", files[0].filename);
  }

  @Put(":id")
  async update(@Param("id") id: number, @Body() createDishDto: CreateDishDto, @Auth() auth: UserDto) {
    let dish = await this.dishesService.findById(id);
    if (!dish)
      throw new NotFoundException(`Dish with id "${id}" doesn't exist!`);
    if (!this.abilityService.authorize(auth, AbilityAction.Update, dish))
      throw new ForbiddenException();
    await this.dishesService.update(id, createDishDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: number, @Auth() auth: UserDto) {
    let dish = await this.dishesService.findById(id);
    if (!dish)
      throw new NotFoundException(`Dish with id "${id}" doesn't exist!`);
    if (!this.abilityService.authorize(auth, AbilityAction.Update, dish))
      throw new ForbiddenException();
    await this.dishesService.remove(id);
  }
}
