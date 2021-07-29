import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("plan_user_info_uuid_index", ["uuid", "serverUuid"], {})
@Entity("plan_user_info", { schema: "customer_199616_master" })
export class PlanUserInfo {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "uuid", length: 36 })
  uuid: string;

  @Column("varchar", { name: "server_uuid", length: 36 })
  serverUuid: string;

  @Column("varchar", { name: "join_address", nullable: true, length: 255 })
  joinAddress: string | null;

  @Column("bigint", { name: "registered" })
  registered: string;

  @Column("tinyint", { name: "opped", width: 1, default: () => "'0'" })
  opped: boolean;

  @Column("tinyint", { name: "banned", width: 1, default: () => "'0'" })
  banned: boolean;
}
