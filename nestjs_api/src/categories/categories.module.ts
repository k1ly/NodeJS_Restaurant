import { forwardRef, Module } from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { CategoriesController } from "./categories.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Category } from "./entities/category.entity";
import { CategoriesProfile } from "./categories.profile";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [TypeOrmModule.forFeature([Category]),
    forwardRef(() => AuthModule)],
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoriesProfile],
  exports: [CategoriesService, CategoriesProfile]
})
export class CategoriesModule {
}
