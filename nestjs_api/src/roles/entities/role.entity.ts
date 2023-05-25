import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { AutoMap } from "@automapper/classes";

@Entity({ name: "roles" })
export class Role {
  @AutoMap()
  @PrimaryGeneratedColumn()
  id: number;

  @AutoMap()
  @Column()
  name: string;
}
