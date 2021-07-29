import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PlanSessions } from "./PlanSessions";

@Index("session_id", ["sessionId"], {})
@Index("plan_kills_uuid_index", ["killerUuid", "victimUuid", "serverUuid"], {})
@Index("plan_kills_date_index", ["date"], {})
@Entity("plan_kills", { schema: "customer_199616_master" })
export class PlanKills {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "killer_uuid", length: 36 })
  killerUuid: string;

  @Column("varchar", { name: "victim_uuid", length: 36 })
  victimUuid: string;

  @Column("varchar", { name: "server_uuid", length: 36 })
  serverUuid: string;

  @Column("varchar", { name: "weapon", length: 30 })
  weapon: string;

  @Column("bigint", { name: "date" })
  date: string;

  @Column("int", { name: "session_id" })
  sessionId: number;

  @ManyToOne(() => PlanSessions, (planSessions) => planSessions.planKills, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "session_id", referencedColumnName: "id" }])
  session: PlanSessions;
}
