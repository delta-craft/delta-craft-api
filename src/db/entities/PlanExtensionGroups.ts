import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PlanExtensionProviders } from "./PlanExtensionProviders";

@Index("provider_id", ["providerId"], {})
@Entity("plan_extension_groups", { schema: "customer_199616_master" })
export class PlanExtensionGroups {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "uuid", length: 36 })
  uuid: string;

  @Column("varchar", { name: "group_name", nullable: true, length: 50 })
  groupName: string | null;

  @Column("int", { name: "provider_id" })
  providerId: number;

  @ManyToOne(
    () => PlanExtensionProviders,
    (planExtensionProviders) => planExtensionProviders.planExtensionGroups,
    { onDelete: "RESTRICT", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "provider_id", referencedColumnName: "id" }])
  provider: PlanExtensionProviders;
}
