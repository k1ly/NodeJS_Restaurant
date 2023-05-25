import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Status } from "../../statuses/entities/status.entity";
import { Address } from "../../addresses/entities/address.entity";
import { OrderItem } from "../../order-items/entities/order-item.entity";
import { AutoMap } from "@automapper/classes";

@Entity({ name: "orders" })
export class Order {
  @AutoMap()
  @PrimaryGeneratedColumn()
  id: number;

  @AutoMap()
  @Column()
  price: number;

  @AutoMap()
  @Column({ name: "specified_date" })
  specifiedDate: Date;

  @AutoMap()
  @Column({ name: "order_date" })
  orderDate: Date;

  @AutoMap()
  @Column({ name: "delivery_date" })
  deliveryDate: Date;

  @AutoMap()
  @ManyToOne(() => Address)
  @JoinColumn({ name: "address_id", referencedColumnName: "id" })
  address: Address;

  @AutoMap()
  @ManyToOne(() => Status)
  @JoinColumn({ name: "status_id", referencedColumnName: "id" })
  status: Status;

  @AutoMap()
  @ManyToOne(() => User, user => user.orders)
  @JoinColumn({ name: "customer_id", referencedColumnName: "id" })
  customer: User;

  @AutoMap()
  @ManyToOne(() => User)
  @JoinColumn({ name: "manager_id", referencedColumnName: "id" })
  manager: User;

  @OneToMany(() => OrderItem, orderItem => orderItem.order)
  orderItems: OrderItem[];
}
