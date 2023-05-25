import { Controller, Get, Query, NotFoundException } from "@nestjs/common";
import { StatusesService } from "./statuses.service";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { Status } from "./entities/status.entity";
import { StatusDto } from "./dto/status.dto";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("statuses")
@Controller("api/statuses")
export class StatusesController {
  constructor(@InjectMapper() private readonly mapper: Mapper,
              private readonly statusesService: StatusesService) {
  }

  @Get("find")
  async findByName(@Query("name") name: string) {
    let status = await this.statusesService.findByName(name);
    if (!status)
      throw new NotFoundException(`Status with name "${name}" doesn't exist!`);
    return this.mapper.map(status, Status, StatusDto);
  }
}
