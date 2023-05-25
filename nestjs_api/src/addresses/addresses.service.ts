import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Address } from "./entities/address.entity";
import { CreateAddressDto } from "./dto/create-address.dto";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { UsersService } from "../users/users.service";
import { Pageable } from "../util/pagination/pagination.pageable";
import { UpdateAddressDto } from "./dto/update-address.dto";

@Injectable()
export class AddressesService {
  constructor(@InjectRepository(Address) private readonly addressesRepository: Repository<Address>,
              @InjectMapper() private readonly mapper: Mapper,
              private readonly usersService: UsersService) {
  }

  async findAll(pageable: Pageable) {
    try {
      return await this.addressesRepository.findAndCount({
          relations: { user: true },
          skip: pageable.page * pageable.size,
          take: pageable.size,
          order: { [pageable.sort]: pageable.order }
        }
      );
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findByUser(userId: number, pageable: Pageable) {
    try {
      let user = await this.usersService.findById(userId);
      return await this.addressesRepository.findAndCount({
          relations: { user: true },
          where: { user },
          skip: pageable.page * pageable.size,
          take: pageable.size,
          order: { [pageable.sort]: pageable.order }
        }
      );
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findById(id: number) {
    try {
      return await this.addressesRepository.findOne({
        relations: { user: true },
        where: { id }
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async create(createAddressDto: CreateAddressDto) {
    try {
      let address = this.mapper.map(createAddressDto, CreateAddressDto, Address);
      address.user = await this.usersService.findById(createAddressDto.user);
      if (!address.user)
        throw new BadRequestException(`User with id "${createAddressDto.user}" doesn't exist!`);
      return await this.addressesRepository.save(address);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: number, updateAddressDto: UpdateAddressDto) {
    try {
      let address = this.mapper.map(updateAddressDto, UpdateAddressDto, Address);
      return this.addressesRepository.update(id, address);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: number) {
    try {
      return await this.addressesRepository.delete(id);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
