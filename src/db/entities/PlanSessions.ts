import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PlanKills } from "./PlanKills";
import { PlanWorldTimes } from "./PlanWorldTimes";

@Index("plan_sessions_uuid_index", ["uuid", "serverUuid"], {})
@Index("plan_sessions_date_index", ["sessionStart"], {})
@Entity("plan_sessions", { schema: "customer_199616_master" })
export class PlanSessions {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "uuid", length: 36 })
  uuid: string;

  @Column("varchar", { name: "server_uuid", length: 36 })
  serverUuid: string;

  @Column("bigint", { name: "session_start" })
  sessionStart: string;

  @Column("bigint", { name: "session_end" })
  sessionEnd: string;

  @Column("int", { name: "mob_kills" })
  mobKills: number;

  @Column("int", { name: "deaths" })
  deaths: number;

  @Column("bigint", { name: "afk_time" })
  afkTime: string;

  @OneToMany(() => PlanKills, (planKills) => planKills.session)
  planKills: PlanKills[];

  @OneToMany(() => PlanWorldTimes, (planWorldTimes) => planWorldTimes.session)
  planWorldTimes: PlanWorldTimes[];
}
