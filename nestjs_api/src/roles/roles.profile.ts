import { Injectable } from "@nestjs/common";
import { MappingProfile, Mapper, createMap } from "@automapper/core";
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { RoleDto } from "./dto/role.dto";
import { Role } from "./entities/role.entity";
import { CreateRoleDto } from "./dto/create-role.dto";

@Injectable()
export class RolesProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  get profile(): MappingProfile {
    return mapper => {
      createMap(mapper, Role, RoleDto);
      createMap(mapper, CreateRoleDto, Role);
    };
  }
}