import { Controller, Get, Post, Body, ForbiddenException } from "@nestjs/common";
import { ReviewsService } from "./reviews.service";
import { CreateReviewDto } from "./dto/create-review.dto";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { AbilityService } from "../auth/ability/ability.service";
import { Auth } from "../auth/auth.decorator";
import { UserDto } from "../users/dto/user.dto";
import { AbilityAction } from "../auth/ability/ability.action";
import { Review } from "./entities/review.entity";
import { ReviewDto } from "./dto/review.dto";
import { Pagination } from "../util/pagination/pagination.decorator";
import { Pageable } from "../util/pagination/pagination.pageable";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("reviews")
@Controller("api/reviews")
export class ReviewsController {
  constructor(@InjectMapper() private readonly mapper: Mapper,
              private readonly reviewsService: ReviewsService,
              private readonly abilityService: AbilityService) {
  }

  @Get()
  async findAll(@Pagination() pageable: Pageable,
                @Auth() auth: UserDto) {
    let [reviews, total] = await this.reviewsService.findAll(pageable);
    if (reviews.some(review => !this.abilityService.authorize(auth, AbilityAction.Read, review)))
      throw new ForbiddenException();
    return {
      content: this.mapper.mapArray(reviews, Review, ReviewDto),
      total: Math.ceil(total / pageable.size),
      pageable
    };
  }

  @Post()
  async create(@Body() createReviewDto: CreateReviewDto, @Auth() auth: UserDto) {
    if (!this.abilityService.authorize(auth, AbilityAction.Create, createReviewDto))
      throw new ForbiddenException();
    await this.reviewsService.create(createReviewDto);
  }
}
