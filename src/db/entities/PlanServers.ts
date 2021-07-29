import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PlanTps } from "./PlanTps";

@Index("uuid", ["uuid"], { unique: true })
@Entity("plan_servers", { schema: "customer_199616_master" })
export class PlanServers {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "uuid", unique: true, length: 36 })
  uuid: string;

  @Column("varchar", { name: "name", nullable: true, length: 100 })
  name: string | null;

  @Column("varchar", { name: "web_address", nullable: true, length: 100 })
  webAddress: string | null;

  @Column("tinyint", { name: "is_installed", width: 1, default: () => "'1'" })
  isInstalled: boolean;

  @Column("tinyint", { name: "is_proxy", width: 1, default: () => "'0'" })
  isProxy: boolean;

  @Column("int", { name: "max_players", default: () => "'-1'" })
  maxPlayers: number;

  @OneToMany(() => PlanTps, (planTps) => planTps.server)
  planTps: PlanTps[];
}
