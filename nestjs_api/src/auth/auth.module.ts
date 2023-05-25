import { forwardRef, Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard } from "./auth.guard";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UsersModule } from "../users/users.module";
import { AbilityService } from "./ability/ability.service";
import { RolesModule } from "../roles/roles.module";
import { StatusesModule } from "../statuses/statuses.module";
import { DishesModule } from "../dishes/dishes.module";
import { TokenService } from "./token/token.service";
import { RedisModule } from "@liaoliaots/nestjs-redis";

@Module({
  imports: [
    ConfigModule.forRoot(),
    RedisModule.forRootAsync({
      imports: [ConfigModule.forRoot()],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          config: {
            url: configService.get("REDIS_URL")
          }
        };
      }
    }),
    JwtModule,
    RolesModule,
    StatusesModule,
    forwardRef(() => UsersModule),
    forwardRef(() => DishesModule)],
  controllers: [AuthController],
  providers: [
    AuthService,
    AbilityService,
    TokenService, {
      provide: APP_GUARD,
      useClass: AuthGuard
    }],
  exports: [AbilityService]
})
export class AuthModule {
}
