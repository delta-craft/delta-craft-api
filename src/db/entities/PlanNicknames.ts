import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("plan_nicknames", { schema: "customer_199616_master" })
export class PlanNicknames {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "uuid", length: 36 })
  uuid: string;

  @Column("varchar", { name: "nickname", length: 75 })
  nickname: string;

  @Column("varchar", { name: "server_uuid", length: 36 })
  serverUuid: string;

  @Column("bigint", { name: "last_used" })
  lastUsed: string;
}
