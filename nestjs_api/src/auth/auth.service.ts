import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  InternalServerErrorException
} from "@nestjs/common";
import { UserDto } from "../users/dto/user.dto";
import { AuthDto } from "./dto/auth.dto";
import { compare, hash } from "bcrypt";
import { DataSource } from "typeorm";
import { RolesNames } from "../roles/roles.names";
import { RolesService } from "../roles/roles.service";
import { StatusesNames } from "../statuses/statuses.names";
import { StatusesService } from "../statuses/statuses.service";
import { UsersService } from "../users/users.service";
import { DishesService } from "../dishes/dishes.service";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { CartDto } from "../cart/dto/cart.dto";
import { Order } from "../orders/entities/order.entity";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { User } from "../users/entities/user.entity";
import { OrderItem } from "../order-items/entities/order-item.entity";

export type Payload = { id: number };

@Injectable()
export class AuthService {
  constructor(@InjectMapper() private readonly mapper: Mapper,
              private readonly usersService: UsersService,
              private readonly rolesService: RolesService,
              private readonly statusesService: StatusesService,
              private readonly dishesService: DishesService,
              private readonly dataSource: DataSource) {
  }

  async register(createUserDto: CreateUserDto, cartDtos: CartDto[]) {
    if (await this.usersService.findByLogin(createUserDto.login))
      throw new ConflictException("User with this login already exists");
    createUserDto.password = await hash(createUserDto.password, 10);
    let user = this.mapper.map(createUserDto, CreateUserDto, User);
    user.role = await this.rolesService.findByName(RolesNames.Client);
    if (!user.role)
      throw new BadRequestException(`Role with name "${RolesNames.Client}" doesn't exist!`);
    let order = new Order();
    order.status = await this.statusesService.findByName(StatusesNames.Created);
    if (!order.status)
      throw new BadRequestException(`Status with name "${StatusesNames.Created}" doesn't exist!`);
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      user = await queryRunner.manager.save(user);
      order.customer = user;
      user.order = await queryRunner.manager.save(order);
      await queryRunner.manager.save(user);
      user.order.price = 0;
      for (let cartDto of cartDtos) {
        let orderItem = new OrderItem();
        orderItem.quantity = cartDto.quantity;
        orderItem.dish = await this.dishesService.findById(cartDto.dish);
        orderItem.order = user.order;
        await queryRunner.manager.save(orderItem);
        user.order.price += orderItem.quantity * (orderItem.dish.price * (100 - orderItem.dish.discount) / 100);
      }
      user.order.price = Number(user.order.price.toFixed(2));
      await queryRunner.manager.save(user.order);
      await queryRunner.commitTransaction();
      return user;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async authenticate(authDto: AuthDto) {
    let user = await this.usersService.findByLogin(authDto.login);
    if (!user)
      throw new UnauthorizedException("Invalid login or password");
    if (!await compare(authDto.password, user.password))
      throw new UnauthorizedException("Invalid login or password");
    return { id: user.id };
  }

  async createGuest() {
    let role = await this.rolesService.findByName(RolesNames.Guest);
    let guest = new UserDto();
    guest.role = role.name;
    return guest;
  }
}
