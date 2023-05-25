import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersService } from "./users.service";
import { UsersProfile } from "./users.profile";
import { UsersController } from "./users.controller";
import { User } from "./entities/user.entity";
import { RolesModule } from "../roles/roles.module";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [TypeOrmModule.forFeature([User]),
    RolesModule,
    forwardRef(() => AuthModule)],
  controllers: [UsersController],
  providers: [UsersService, UsersProfile],
  exports: [UsersService, UsersProfile]
})
export class UsersModule {
}
