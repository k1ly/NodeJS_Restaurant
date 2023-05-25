import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ForbiddenException, NotFoundException
} from "@nestjs/common";
import { AddressesService } from "./addresses.service";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { AbilityService } from "../auth/ability/ability.service";
import { Auth } from "../auth/auth.decorator";
import { UserDto } from "../users/dto/user.dto";
import { AbilityAction } from "../auth/ability/ability.action";
import { Address } from "./entities/address.entity";
import { AddressDto } from "./dto/address.dto";
import { CreateAddressDto } from "./dto/create-address.dto";
import { Pagination } from "../util/pagination/pagination.decorator";
import { Pageable } from "../util/pagination/pagination.pageable";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("addresses")
@Controller("api/addresses")
export class AddressesController {
  constructor(@InjectMapper() private readonly mapper: Mapper,
              private readonly addressesService: AddressesService,
              private readonly abilityService: AbilityService) {
  }

  @Get()
  async findByUser(@Query("user") user: number,
                   @Pagination() pageable: Pageable,
                   @Auth() auth: UserDto) {
    let [addresses, total] = await this.addressesService.findByUser(user, pageable);
    if (addresses.some(address => !this.abilityService.authorize(auth, AbilityAction.Read, address)))
      throw new ForbiddenException();
    return {
      content: this.mapper.mapArray(addresses, Address, AddressDto),
      total: Math.ceil(total / pageable.size),
      pageable
    };
  }

  @Get(":id")
  async findById(@Param("id") id: number, @Auth() auth: UserDto) {
    let address = await this.addressesService.findById(id);
    if (!address)
      throw new NotFoundException(`Address with id "${id}" doesn't exist!`);
    if (!this.abilityService.authorize(auth, AbilityAction.Read, address))
      throw new ForbiddenException();
    return this.mapper.map(address, Address, AddressDto);
  }

  @Post()
  async create(@Body() createAddressDto: CreateAddressDto, @Auth() auth: UserDto) {
    if (!this.abilityService.authorize(auth, AbilityAction.Create, Address))
      throw new ForbiddenException();
    await this.addressesService.create(createAddressDto);
  }
}
