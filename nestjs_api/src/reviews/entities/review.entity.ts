import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";
import { AutoMap } from "@automapper/classes";

@Entity({ name: "reviews" })
export class Review {
  @AutoMap()
  @PrimaryGeneratedColumn()
  id: number;

  @AutoMap()
  @Column()
  grade: number;

  @AutoMap()
  @Column()
  comment: string;

  @AutoMap()
  @Column()
  date: Date;

  @AutoMap()
  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user: User;
}
