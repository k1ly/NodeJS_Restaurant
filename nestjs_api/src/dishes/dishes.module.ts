import { forwardRef, Module } from "@nestjs/common";
import { DishesService } from "./dishes.service";
import { DishesController } from "./dishes.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Dish } from "./entities/dish.entity";
import { DishesProfile } from "./dishes.profile";
import { MulterModule } from "@nestjs/platform-express";
import { AuthModule } from "../auth/auth.module";
import { CategoriesModule } from "../categories/categories.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { join } from "path";
import { diskStorage } from "multer";

@Module({
  imports: [TypeOrmModule.forFeature([Dish]),
    MulterModule.registerAsync(
      {
        imports: [ConfigModule.forRoot()],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          dest: join(__dirname, configService.get("PUBLIC_DIRECTORY"), "dishes"),
          storage: diskStorage({
            destination: "./public/dishes"
          })
        })
      }),
    forwardRef(() => CategoriesModule),
    forwardRef(() => AuthModule)],
  controllers: [DishesController],
  providers: [DishesService, DishesProfile],
  exports: [DishesService, DishesProfile]
})
export class DishesModule {
}
