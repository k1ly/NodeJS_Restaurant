import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { Address } from "../../addresses/entities/address.entity";
import { Role } from "../../roles/entities/role.entity";
import { Order } from "../../orders/entities/order.entity";
import { AutoMap } from "@automapper/classes";

@Entity({ name: "users" })
export class User {
  @AutoMap()
  @PrimaryGeneratedColumn()
  id: number;

  @AutoMap()
  @Column()
  login: string;

  @AutoMap()
  @Column()
  password: string;

  @AutoMap()
  @Column()
  name: string;

  @AutoMap()
  @Column()
  email: string;

  @AutoMap()
  @Column()
  phone: string;

  @AutoMap()
  @Column()
  blocked: boolean;

  @AutoMap()
  @ManyToOne(() => Role)
  @JoinColumn({ name: "role_id", referencedColumnName: "id" })
  role: Role;

  @AutoMap()
  @ManyToOne(() => Order)
  @JoinColumn({ name: "order_id", referencedColumnName: "id" })
  order: Order;

  @OneToMany(() => Address, address => address.user)
  addresses: Address[];

  @OneToMany(() => Order, order => order.customer)
  orders: Order[];
}