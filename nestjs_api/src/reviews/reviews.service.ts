import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Review } from "./entities/review.entity";
import { CreateReviewDto } from "./dto/create-review.dto";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { UsersService } from "../users/users.service";
import { UpdateReviewDto } from "./dto/update-review.dto";
import { Pageable } from "../util/pagination/pagination.pageable";

@Injectable()
export class ReviewsService {
  constructor(@InjectRepository(Review) private readonly reviewsRepository: Repository<Review>,
              @InjectMapper() private readonly mapper: Mapper,
              private readonly usersService: UsersService) {
  }

  async findAll(pageable: Pageable) {
    try {
      return await this.reviewsRepository.findAndCount({
          relations: { user: true },
          skip: pageable.page * pageable.size,
          take: pageable.size,
          order: { [pageable.sort]: pageable.order }
        }
      );
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findById(id: number) {
    try {
      return await this.reviewsRepository.findOne({
        relations: { user: true },
        where: { id }
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async create(createReviewDto: CreateReviewDto) {
    let review = this.mapper.map(createReviewDto, CreateReviewDto, Review);
    review.user = await this.usersService.findById(createReviewDto.user);
    if (!review.user)
      throw new BadRequestException(`User with id "${createReviewDto.user}" doesn't exist!`);
    try {
      return await this.reviewsRepository.save(review);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: number, updateReviewDto: UpdateReviewDto) {
    let review = this.mapper.map(updateReviewDto, UpdateReviewDto, Review);
    try {
      return this.reviewsRepository.update(id, review);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: number) {
    try {
      return await this.reviewsRepository.delete(id);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
