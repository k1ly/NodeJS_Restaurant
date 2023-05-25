import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Category } from "../../categories/entities/category.entity";
import { AutoMap } from "@automapper/classes";

@Entity({ name: "dishes" })
export class Dish {
  @AutoMap()
  @PrimaryGeneratedColumn()
  id: number;

  @AutoMap()
  @Column()
  name: string;

  @AutoMap()
  @Column()
  description: string;

  @AutoMap()
  @Column({ name: "image_url" })
  imageUrl: string;

  @AutoMap()
  @Column()
  weight: number;

  @AutoMap()
  @Column()
  price: number;

  @AutoMap()
  @Column()
  discount: number;

  @AutoMap()
  @ManyToOne(() => Category, category => category.dishes)
  @JoinColumn({ name: "category_id", referencedColumnName: "id" })
  category: Category;
}
