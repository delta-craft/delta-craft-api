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
@Entity("plan_extension_server_values", { schema: "customer_199616_master" })
export class PlanExtensionServerValues {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("tinyint", { name: "boolean_value", nullable: true, width: 1 })
  booleanValue: boolean | null;

  @Column("double", { name: "double_value", nullable: true, precision: 22 })
  doubleValue: number | null;

  @Column("double", { name: "percentage_value", nullable: true, precision: 22 })
  percentageValue: number | null;

  @Column("bigint", { name: "long_value", nullable: true })
  longValue: string | null;

  @Column("varchar", { name: "string_value", nullable: true, length: 50 })
  stringValue: string | null;

  @Column("varchar", { name: "group_value", nullable: true, length: 50 })
  groupValue: string | null;

  @Column("int", { name: "provider_id" })
  providerId: number;

  @ManyToOne(
    () => PlanExtensionProviders,
    (planExtensionProviders) =>
      planExtensionProviders.planExtensionServerValues,
    { onDelete: "RESTRICT", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "provider_id", referencedColumnName: "id" }])
  provider: PlanExtensionProviders;
}
