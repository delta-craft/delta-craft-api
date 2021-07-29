import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PlanWorlds } from "./PlanWorlds";
import { PlanSessions } from "./PlanSessions";

@Index("world_id", ["worldId"], {})
@Index("session_id", ["sessionId"], {})
@Index("plan_world_times_uuid_index", ["uuid", "serverUuid"], {})
@Entity("plan_world_times", { schema: "customer_199616_master" })
export class PlanWorldTimes {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "uuid", length: 36 })
  uuid: string;

  @Column("int", { name: "world_id" })
  worldId: number;

  @Column("varchar", { name: "server_uuid", length: 36 })
  serverUuid: string;

  @Column("int", { name: "session_id" })
  sessionId: number;

  @Column("bigint", { name: "survival_time", default: () => "'0'" })
  survivalTime: string;

  @Column("bigint", { name: "creative_time", default: () => "'0'" })
  creativeTime: string;

  @Column("bigint", { name: "adventure_time", default: () => "'0'" })
  adventureTime: string;

  @Column("bigint", { name: "spectator_time", default: () => "'0'" })
  spectatorTime: string;

  @ManyToOne(() => PlanWorlds, (planWorlds) => planWorlds.planWorldTimes, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "world_id", referencedColumnName: "id" }])
  world: PlanWorlds;

  @ManyToOne(
    () => PlanSessions,
    (planSessions) => planSessions.planWorldTimes,
    { onDelete: "RESTRICT", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "session_id", referencedColumnName: "id" }])
  session: PlanSessions;
}
