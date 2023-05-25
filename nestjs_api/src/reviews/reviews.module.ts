import { forwardRef, Module } from "@nestjs/common";
import { ReviewsService } from "./reviews.service";
import { ReviewsController } from "./reviews.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Review } from "./entities/review.entity";
import { ReviewsProfile } from "./reviews.profile";
import { AuthModule } from "../auth/auth.module";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [TypeOrmModule.forFeature([Review]),
    forwardRef(() => UsersModule),
    forwardRef(() => AuthModule)],
  controllers: [ReviewsController],
  providers: [ReviewsService, ReviewsProfile],
  exports: [ReviewsProfile]
})
export class ReviewsModule {
}
