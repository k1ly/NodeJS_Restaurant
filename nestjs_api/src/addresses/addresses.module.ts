import { forwardRef, Module } from "@nestjs/common";
import { AddressesService } from "./addresses.service";
import { AddressesController } from "./addresses.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Address } from "./entities/address.entity";
import { AddressesProfile } from "./addresses.profile";
import { AuthModule } from "../auth/auth.module";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [TypeOrmModule.forFeature([Address]),
    forwardRef(() => UsersModule),
    forwardRef(() => AuthModule)],
  controllers: [AddressesController],
  providers: [AddressesService, AddressesProfile],
  exports: [AddressesService, AddressesProfile]
})
export class AddressesModule {
}
