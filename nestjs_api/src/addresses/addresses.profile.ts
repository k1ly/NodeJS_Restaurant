import { Injectable } from "@nestjs/common";
import { MappingProfile, Mapper, createMap, forMember, mapFrom } from "@automapper/core";
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { Address } from "./entities/address.entity";
import { AddressDto } from "./dto/address.dto";
import { CreateAddressDto } from "./dto/create-address.dto";
import { UpdateAddressDto } from "./dto/update-address.dto";

@Injectable()
export class AddressesProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  get profile(): MappingProfile {
    return mapper => {
      createMap(mapper, Address, AddressDto,
        forMember(addressDto => addressDto.user, mapFrom(address => address.user?.id)));
      createMap(mapper, CreateAddressDto, Address);
      createMap(mapper, UpdateAddressDto, Address);
    };
  }
}