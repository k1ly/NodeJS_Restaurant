import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AutomapperModule } from "@automapper/nestjs";
import { classes } from "@automapper/classes";
import { UsersModule } from "./users/users.module";
import { RolesModule } from "./roles/roles.module";
import { AddressesModule } from "./addresses/addresses.module";
import { DishesModule } from "./dishes/dishes.module";
import { CategoriesModule } from "./categories/categories.module";
import { OrdersModule } from "./orders/orders.module";
import { StatusesModule } from "./statuses/statuses.module";
import { OrderItemsModule } from "./order-items/order-items.module";
import { ReviewsModule } from "./reviews/reviews.module";
import { AuthModule } from "./auth/auth.module";
import { CartModule } from "./cart/cart.module";
import { LoggingModule } from "./logging/logging.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";

@Module({
  imports: [
    ServeStaticModule.forRootAsync({
      imports: [ConfigModule.forRoot()],
      inject: [ConfigService],
      useFactory: configService => ([{
        rootPath: join(__dirname, "..", configService.get("PUBLIC_DIRECTORY"))
      }])
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forRoot()],
      inject: [ConfigService],
      useFactory: configService => ({
        type: configService.get("DB_TYPE"),
        host: configService.get("DB_HOST"),
        port: Number(configService.get("DB_PORT")),
        username: configService.get("DB_USERNAME"),
        password: configService.get("DB_PASSWORD"),
        database: configService.get("DB_DATABASE"),
        autoLoadEntities: true,
        extra: { trustServerCertificate: true }
      })
    }),
    AutomapperModule.forRoot({
      strategyInitializer: classes()
    }),
    RolesModule,
    StatusesModule,
    AuthModule,
    UsersModule,
    CategoriesModule,
    DishesModule,
    OrdersModule,
    OrderItemsModule,
    AddressesModule,
    ReviewsModule,
    CartModule,
    LoggingModule]
})
export class AppModule {
}
