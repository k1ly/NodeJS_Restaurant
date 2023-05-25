import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Role } from "./entities/role.entity";
import { CreateRoleDto } from "./dto/create-role.dto";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";

@Injectable()
export class RolesService {
  constructor(@InjectRepository(Role) private readonly rolesRepository: Repository<Role>,
              @InjectMapper() private readonly mapper: Mapper) {
  }

  async findAll() {
    try {
      return await this.rolesRepository.find();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findById(id: number) {
    try {
      return await this.rolesRepository.findOneBy({ id });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findByName(name: string) {
    try {
      return await this.rolesRepository.findOneBy({ name });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async create(createRoleDto: CreateRoleDto) {
    let role = this.mapper.map(createRoleDto, CreateRoleDto, Role);
    try {
      return await this.rolesRepository.create(role);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: number, createRoleDto: CreateRoleDto) {
    let role = this.mapper.map(createRoleDto, CreateRoleDto, Role);
    try {
      return await this.rolesRepository.update(id, role);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: number) {
    try {
      return await this.rolesRepository.delete(id);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
