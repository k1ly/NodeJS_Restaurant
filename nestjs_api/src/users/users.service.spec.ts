import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersService } from "./users.service";
import { User } from "./entities/user.entity";
import { Role } from "../roles/entities/role.entity";
import { Order } from "../orders/entities/order.entity";
import { Address } from "../addresses/entities/address.entity";
import { Status } from "../statuses/entities/status.entity";
import { OrderItem } from "../order-items/entities/order-item.entity";
import { Dish } from "../dishes/entities/dish.entity";
import { Category } from "../categories/entities/category.entity";

describe("UsersService", () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot({
        type: "mssql",
        host: "localhost",
        port: 1433,
        username: "sa",
        password: "Kirill1203",
        database: "restaurant",
        autoLoadEntities: true,
        extra: { trustServerCertificate: true }
      }), TypeOrmModule.forFeature([User, Role, Order, Address, Status, OrderItem, Dish, Category])],
      providers: [UsersService]
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("find admin by id", async () => {
    let user = await service.findById(1);
    expect(user).toMatchObject({ login: "admin" });
  });

});
