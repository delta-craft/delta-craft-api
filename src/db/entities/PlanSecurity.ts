import { Column, Entity, Index } from "typeorm";

@Index("username", ["username"], { unique: true })
@Index("salted_pass_hash", ["saltedPassHash"], { unique: true })
@Entity("plan_security", { schema: "customer_199616_master" })
export class PlanSecurity {
  @Column("varchar", { name: "username", length: 100 })
  username: string;

  @Column("varchar", {
    name: "linked_to_uuid",
    nullable: true,
    length: 36,
    default: () => "''",
  })
  linkedToUuid: string | null;

  @Column("varchar", { name: "salted_pass_hash", unique: true, length: 100 })
  saltedPassHash: string;

  @Column("int", { name: "permission_level" })
  permissionLevel: number;
}
