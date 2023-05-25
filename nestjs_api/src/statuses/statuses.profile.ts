import { Injectable } from "@nestjs/common";
import { MappingProfile, Mapper, createMap } from "@automapper/core";
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { Status } from "./entities/status.entity";
import { StatusDto } from "./dto/status.dto";
import { CreateStatusDto } from "./dto/create-status.dto";

@Injectable()
export class StatusesProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  get profile(): MappingProfile {
    return mapper => {
      createMap(mapper, Status, StatusDto);
      createMap(mapper, CreateStatusDto, Status);
    };
  }
}