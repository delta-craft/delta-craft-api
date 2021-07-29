import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("server_uuid", ["serverUuid"], { unique: true })
@Entity("plan_settings", { schema: "customer_199616_master" })
export class PlanSettings {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "server_uuid", unique: true, length: 39 })
  serverUuid: string;

  @Column("bigint", { name: "updated" })
  updated: string;

  @Column("text", { name: "content" })
  content: string;
}
