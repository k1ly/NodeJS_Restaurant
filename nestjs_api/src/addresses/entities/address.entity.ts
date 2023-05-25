import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";
import { AutoMap } from "@automapper/classes";

@Entity({ name: "addresses" })
export class Address {
  @AutoMap()
  @PrimaryGeneratedColumn()
  id: number;

  @AutoMap()
  @Column()
  country: string;

  @AutoMap()
  @Column()
  locality: string;

  @AutoMap()
  @Column()
  street: string;

  @AutoMap()
  @Column()
  house: string;

  @AutoMap()
  @Column()
  apartment: string;

  @AutoMap()
  @ManyToOne(() => User, user => user.addresses)
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user: User;
}
