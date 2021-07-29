import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PlanExtensionTables } from "./PlanExtensionTables";

@Index("table_id", ["tableId"], {})
@Entity("plan_extension_server_table_values", {
  schema: "customer_199616_master",
})
export class PlanExtensionServerTableValues {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "uuid", length: 36 })
  uuid: string;

  @Column("int", { name: "table_row", default: () => "'0'" })
  tableRow: number;

  @Column("varchar", { name: "col_1_value", nullable: true, length: 250 })
  col_1Value: string | null;

  @Column("varchar", { name: "col_2_value", nullable: true, length: 250 })
  col_2Value: string | null;

  @Column("varchar", { name: "col_3_value", nullable: true, length: 250 })
  col_3Value: string | null;

  @Column("varchar", { name: "col_4_value", nullable: true, length: 250 })
  col_4Value: string | null;

  @Column("varchar", { name: "col_5_value", nullable: true, length: 250 })
  col_5Value: string | null;

  @Column("int", { name: "table_id" })
  tableId: number;

  @ManyToOne(
    () => PlanExtensionTables,
    (planExtensionTables) => planExtensionTables.planExtensionServerTableValues,
    { onDelete: "RESTRICT", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "table_id", referencedColumnName: "id" }])
  table: PlanExtensionTables;
}
