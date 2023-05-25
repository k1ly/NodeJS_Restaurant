import { Module } from "@nestjs/common";
import { CartService } from "./cart.service";
import { CartController } from "./cart.controller";
import { DishesModule } from "../dishes/dishes.module";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot(),
    DishesModule],
  controllers: [CartController],
  providers: [CartService]
})
export class CartModule {
}
