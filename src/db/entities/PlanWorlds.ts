import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PlanWorldTimes } from "./PlanWorldTimes";

@Entity("plan_worlds", { schema: "customer_199616_master" })
export class PlanWorlds {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "world_name", length: 100 })
  worldName: string;

  @Column("varchar", { name: "server_uuid", length: 36 })
  serverUuid: string;

  @OneToMany(() => PlanWorldTimes, (planWorldTimes) => planWorldTimes.world)
  planWorldTimes: PlanWorldTimes[];
}
