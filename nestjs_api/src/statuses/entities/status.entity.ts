import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { AutoMap } from "@automapper/classes";

@Entity({ name: "statuses" })
export class Status {
  @AutoMap()
  @PrimaryGeneratedColumn()
  id: number;

  @AutoMap()
  @Column()
  name: string;
}
