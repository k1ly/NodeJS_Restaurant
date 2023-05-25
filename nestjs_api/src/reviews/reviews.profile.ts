import { Injectable } from "@nestjs/common";
import { MappingProfile, Mapper, createMap, forMember, mapFrom } from "@automapper/core";
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { CreateReviewDto } from "./dto/create-review.dto";
import { ReviewDto } from "./dto/review.dto";
import { Review } from "./entities/review.entity";
import { UpdateReviewDto } from "./dto/update-review.dto";

@Injectable()
export class ReviewsProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  get profile(): MappingProfile {
    return mapper => {
      createMap(mapper, Review, ReviewDto,
        forMember(reviewDto => reviewDto.user, mapFrom(review => review.user?.name)));
      createMap(mapper, CreateReviewDto, Review);
      createMap(mapper, UpdateReviewDto, Review);
    };
  }
}