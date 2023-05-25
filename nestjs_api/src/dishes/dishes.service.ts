import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Like, Repository } from "typeorm";
import { Dish } from "./entities/dish.entity";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { CategoriesService } from "../categories/categories.service";
import { CreateDishDto } from "./dto/create-dish.dto";
import { Pageable } from "../util/pagination/pagination.pageable";

@Injectable()
export class DishesService {
  constructor(@InjectRepository(Dish) private readonly dishesRepository: Repository<Dish>,
              @InjectMapper() private readonly mapper: Mapper,
              private readonly categoriesService: CategoriesService) {
  }

  async findAll(pageable: Pageable) {
    try {
      return await this.dishesRepository.findAndCount({
          relations: { category: true },
          skip: pageable.page * pageable.size,
          take: pageable.size,
          order: { [pageable.sort]: pageable.order }
        }
      );
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findByCategory(categoryId: number, pageable: Pageable) {
    try {
      let category = await this.categoriesService.findById(categoryId);
      return await this.dishesRepository.findAndCount({
        relations: { category: true },
        where: { category },
        skip: pageable.page * pageable.size,
        take: pageable.size,
        order: { [pageable.sort]: pageable.order }
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findByFilter(filter: string, pageable: Pageable) {
    try {
      return await this.dishesRepository.findAndCount({
        relations: { category: true },
        where: { name: Like(`%${filter}%`) },
        skip: pageable.page * pageable.size,
        take: pageable.size,
        order: { [pageable.sort]: pageable.order }
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findById(id: number) {
    try {
      return await this.dishesRepository.findOne({
        relations: { category: true },
        where: { id }
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async create(createDishDto: CreateDishDto) {
    let dish = this.mapper.map(createDishDto, CreateDishDto, Dish);
    dish.category = await this.categoriesService.findById(createDishDto.category);
    if (!dish.category)
      throw new BadRequestException(`Category with id "${createDishDto.category}" doesn't exist!`);
    try {
      return await this.dishesRepository.save(dish);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: number, createDishDto: CreateDishDto) {
    let dish = this.mapper.map(createDishDto, CreateDishDto, Dish);
    dish.category = await this.categoriesService.findById(createDishDto.category);
    if (!dish.category)
      throw new BadRequestException(`Category with id "${createDishDto.category}" doesn't exist!`);
    try {
      return this.dishesRepository.update(id, dish);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: number) {
    try {
      return await this.dishesRepository.delete(id);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
