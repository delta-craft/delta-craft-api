import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { PlanServers } from "./PlanServers";

@Index("server_id", ["serverId"], {})
@Index("plan_tps_date_index", ["date"], {})
@Entity("plan_tps", { schema: "customer_199616_master" })
export class PlanTps {
  @Column("int", { name: "server_id" })
  serverId: number;

  @Column("bigint", { name: "date" })
  date: string;

  @Column("double", { name: "tps", precision: 22 })
  tps: number;

  @Column("int", { name: "players_online" })
  playersOnline: number;

  @Column("double", { name: "cpu_usage", precision: 22 })
  cpuUsage: number;

  @Column("bigint", { name: "ram_usage" })
  ramUsage: string;

  @Column("int", { name: "entities" })
  entities: number;

  @Column("int", { name: "chunks_loaded" })
  chunksLoaded: number;

  @Column("bigint", { name: "free_disk_space" })
  freeDiskSpace: string;

  @ManyToOne(() => PlanServers, (planServers) => planServers.planTps, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "server_id", referencedColumnName: "id" }])
  server: PlanServers;
}
