import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("plan_ping_uuid_index", ["uuid", "serverUuid"], {})
@Index("plan_ping_date_index", ["date"], {})
@Entity("plan_ping", { schema: "customer_199616_master" })
export class PlanPing {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "uuid", length: 36 })
  uuid: string;

  @Column("varchar", { name: "server_uuid", length: 36 })
  serverUuid: string;

  @Column("bigint", { name: "date" })
  date: string;

  @Column("int", { name: "max_ping" })
  maxPing: number;

  @Column("int", { name: "min_ping" })
  minPing: number;

  @Column("double", { name: "avg_ping", precision: 22 })
  avgPing: number;
}
