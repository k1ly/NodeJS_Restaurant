import { Module } from "@nestjs/common";
import { StatusesService } from "./statuses.service";
import { StatusesController } from "./statuses.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Status } from "./entities/status.entity";
import { StatusesProfile } from "./statuses.profile";

@Module({
  imports: [TypeOrmModule.forFeature([Status])],
  controllers: [StatusesController],
  providers: [StatusesService, StatusesProfile],
  exports: [StatusesService, StatusesProfile]
})
export class StatusesModule {
}
