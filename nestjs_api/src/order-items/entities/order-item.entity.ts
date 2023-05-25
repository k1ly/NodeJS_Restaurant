import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Order } from "../../orders/entities/order.entity";
import { Dish } from "../../dishes/entities/dish.entity";
import { AutoMap } from "@automapper/classes";

@Entity({ name: "order_items" })
export class OrderItem {
  @AutoMap()
  @PrimaryGeneratedColumn()
  id: number;

  @AutoMap()
  @Column()
  quantity: number;

  @AutoMap()
  @ManyToOne(() => Dish)
  @JoinColumn({ name: "dish_id", referencedColumnName: "id" })
  dish: Dish;

  @AutoMap()
  @ManyToOne(() => Order, order => order.orderItems)
  @JoinColumn({ name: "order_id", referencedColumnName: "id" })
  order: Order;
}
