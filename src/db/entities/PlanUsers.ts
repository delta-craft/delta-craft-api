import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("uuid", ["uuid"], { unique: true })
@Index("plan_users_uuid_index", ["uuid"], {})
@Entity("plan_users", { schema: "customer_199616_master" })
export class PlanUsers {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "uuid", unique: true, length: 36 })
  uuid: string;

  @Column("bigint", { name: "registered" })
  registered: string;

  @Column("varchar", { name: "name", length: 16 })
  name: string;

  @Column("int", { name: "times_kicked", default: () => "'0'" })
  timesKicked: number;
}
