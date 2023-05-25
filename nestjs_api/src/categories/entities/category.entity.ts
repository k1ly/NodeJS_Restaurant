import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Dish } from "../../dishes/entities/dish.entity";
import { AutoMap } from "@automapper/classes";

@Entity({ name: "categories" })
export class Category {
  @AutoMap()
  @PrimaryGeneratedColumn()
  id: number;

  @AutoMap()
  @Column()
  name: string;

  @OneToMany(() => Dish, dish => dish.category)
  dishes: Dish[];
}
