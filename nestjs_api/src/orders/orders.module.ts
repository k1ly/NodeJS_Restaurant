import { forwardRef, Module } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { OrdersController } from "./orders.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Order } from "./entities/order.entity";
import { OrdersProfile } from "./orders.profile";
import { StatusesModule } from "../statuses/statuses.module";
import { UsersModule } from "../users/users.module";
import { OrdersGateway } from "./orders.gateway";
import { AuthModule } from "../auth/auth.module";
import { AddressesModule } from "../addresses/addresses.module";
import { OrderItemsModule } from "../order-items/order-items.module";
import { DishesModule } from "../dishes/dishes.module";

@Module({
  imports: [TypeOrmModule.forFeature([Order]),
    StatusesModule,
    forwardRef(() => UsersModule),
    forwardRef(() => AddressesModule),
    forwardRef(() => DishesModule),
    forwardRef(() => OrderItemsModule),
    forwardRef(() => AuthModule)],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersProfile, OrdersGateway],
  exports: [OrdersService, OrdersProfile, OrdersGateway]
})
export class OrdersModule {
}
