import { forwardRef, Module } from "@nestjs/common";
import { OrderItemsService } from "./order-items.service";
import { OrderItemsController } from "./order-items.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderItem } from "./entities/order-item.entity";
import { OrderItemsProfile } from "./order-items.profile";
import { DishesModule } from "../dishes/dishes.module";
import { OrdersModule } from "../orders/orders.module";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [TypeOrmModule.forFeature([OrderItem]),
    forwardRef(() => DishesModule),
    forwardRef(() => OrdersModule),
    forwardRef(() => AuthModule)],
  controllers: [OrderItemsController],
  providers: [OrderItemsService, OrderItemsProfile],
  exports: [OrderItemsService, OrderItemsProfile]
})
export class OrderItemsModule {
}
