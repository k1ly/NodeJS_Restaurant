import { BadRequestException, forwardRef, Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { OrderItem } from "./entities/order-item.entity";
import { CreateOrderItemDto } from "./dto/create-order-item.dto";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { DishesService } from "../dishes/dishes.service";
import { OrdersService } from "../orders/orders.service";
import { UpdateOrderItemDto } from "./dto/update-order-item.dto";
import { Pageable } from "../util/pagination/pagination.pageable";

@Injectable()
export class OrderItemsService {
  constructor(@InjectRepository(OrderItem) private readonly orderItemsRepository: Repository<OrderItem>,
              @InjectMapper() private readonly mapper: Mapper,
              private readonly dishesService: DishesService,
              @Inject(forwardRef(() => OrdersService))
              private readonly ordersService: OrdersService,
              private readonly dataSource: DataSource) {
  }

  async findAll(pageable: Pageable) {
    try {
      return await this.orderItemsRepository.findAndCount({
          relations: { dish: true, order: true },
          skip: pageable.page * pageable.size,
          take: pageable.size,
          order: { [pageable.sort]: pageable.order }
        }
      );
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findByOrder(orderId: number, pageable: Pageable) {
    try {
      let order = await this.ordersService.findById(orderId);
      return await this.orderItemsRepository.findAndCount({
          relations: { dish: true, order: true },
          where: { order },
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
      return await this.orderItemsRepository.findOne({
        relations: { dish: true, order: true },
        where: { id }
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findByDishAndOrder(dishId: number, orderId: number) {
    try {
      let dish = await this.dishesService.findById(dishId);
      let order = await this.ordersService.findById(orderId);
      return await this.orderItemsRepository.findOne({
          relations: { dish: true, order: true },
          where: { dish, order }
        }
      );
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async create(createOrderItemDto: CreateOrderItemDto) {
    let orderItem = await this.findByDishAndOrder(createOrderItemDto.dish, createOrderItemDto.order);
    if (orderItem) {
      let updateOrderItemDto = new UpdateOrderItemDto();
      updateOrderItemDto.quantity = orderItem.quantity + createOrderItemDto.quantity;
      await this.update(orderItem.id, updateOrderItemDto);
    } else {
      orderItem = this.mapper.map(createOrderItemDto, CreateOrderItemDto, OrderItem);
      orderItem.dish = await this.dishesService.findById(createOrderItemDto.dish);
      if (!orderItem.dish)
        throw new BadRequestException(`Dish with id "${createOrderItemDto.dish}" doesn't exist!`);
      orderItem.order = await this.ordersService.findById(createOrderItemDto.order);
      if (!orderItem.order)
        throw new BadRequestException(`Order with id "${createOrderItemDto.order}" doesn't exist!`);
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        orderItem = await queryRunner.manager.save(orderItem);
        let order = await this.ordersService.findById(orderItem.order.id);
        let orderItems = await queryRunner.manager.find(OrderItem, {
          relations: { dish: true },
          where: { order: orderItem.order }
        });
        order.price = 0;
        for (const orderItem of orderItems) {
          order.price += orderItem.quantity * (orderItem.dish.price * (100 - orderItem.dish.discount) / 100);
        }
        order.price = Number(order.price.toFixed(2));
        await queryRunner.manager.save(order);
        await queryRunner.commitTransaction();
        return orderItem;
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw new InternalServerErrorException(error.message);
      } finally {
        await queryRunner.release();
      }
    }
  }

  async update(id: number, updateOrderItemDto: UpdateOrderItemDto) {
    let orderItem = await this.findById(id);
    let newOrderItem = this.mapper.map(updateOrderItemDto, UpdateOrderItemDto, OrderItem);
    let order = await this.ordersService.findById(orderItem.order.id);
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let result = await queryRunner.manager.update(OrderItem, id, newOrderItem);
      let orderItems = await queryRunner.manager.find(OrderItem, {
        relations: { dish: true },
        where: { order: orderItem.order }
      });
      order.price = 0;
      for (const orderItem of orderItems) {
        order.price += orderItem.quantity * (orderItem.dish.price * (100 - orderItem.dish.discount) / 100);
      }
      order.price = Number(order.price.toFixed(2));
      await queryRunner.manager.save(order);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number) {
    let orderItem = await this.findById(id);
    let order = await this.ordersService.findById(orderItem.order.id);
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let result = await queryRunner.manager.delete(OrderItem, id);
      let orderItems = await queryRunner.manager.find(OrderItem, {
        relations: { dish: true },
        where: { order: orderItem.order }
      });
      order.price = 0;
      for (const orderItem of orderItems) {
        order.price += orderItem.quantity * (orderItem.dish.price * (100 - orderItem.dish.discount) / 100);
      }
      order.price = Number(order.price.toFixed(2));
      await queryRunner.manager.save(order);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(error.message);
    } finally {
      await queryRunner.release();
    }
  }
}
