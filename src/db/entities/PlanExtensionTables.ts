import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PlanExtensionUserTableValues } from "./PlanExtensionUserTableValues";
import { PlanExtensionServerTableValues } from "./PlanExtensionServerTableValues";
import { PlanExtensionPlugins } from "./PlanExtensionPlugins";
import { PlanExtensionIcons } from "./PlanExtensionIcons";
import { PlanExtensionTabs } from "./PlanExtensionTabs";

@Index("plugin_id", ["pluginId"], {})
@Index("icon_1_id", ["icon_1Id"], {})
@Index("icon_2_id", ["icon_2Id"], {})
@Index("icon_3_id", ["icon_3Id"], {})
@Index("icon_4_id", ["icon_4Id"], {})
@Index("icon_5_id", ["icon_5Id"], {})
@Index("tab_id", ["tabId"], {})
@Entity("plan_extension_tables", { schema: "customer_199616_master" })
export class PlanExtensionTables {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", length: 50 })
  name: string;

  @Column("varchar", { name: "color", length: 25, default: () => "'NONE'" })
  color: string;

  @Column("int", { name: "values_for", nullable: true, default: () => "'0'" })
  valuesFor: number | null;

  @Column("varchar", { name: "condition_name", nullable: true, length: 54 })
  conditionName: string | null;

  @Column("varchar", { name: "col_1_name", nullable: true, length: 50 })
  col_1Name: string | null;

  @Column("varchar", { name: "col_2_name", nullable: true, length: 50 })
  col_2Name: string | null;

  @Column("varchar", { name: "col_3_name", nullable: true, length: 50 })
  col_3Name: string | null;

  @Column("varchar", { name: "col_4_name", nullable: true, length: 50 })
  col_4Name: string | null;

  @Column("varchar", { name: "col_5_name", nullable: true, length: 50 })
  col_5Name: string | null;

  @Column("int", { name: "plugin_id" })
  pluginId: number;

  @Column("int", { name: "icon_1_id", nullable: true })
  icon_1Id: number | null;

  @Column("int", { name: "icon_2_id", nullable: true })
  icon_2Id: number | null;

  @Column("int", { name: "icon_3_id", nullable: true })
  icon_3Id: number | null;

  @Column("int", { name: "icon_4_id", nullable: true })
  icon_4Id: number | null;

  @Column("int", { name: "icon_5_id", nullable: true })
  icon_5Id: number | null;

  @Column("int", { name: "tab_id", nullable: true })
  tabId: number | null;

  @OneToMany(
    () => PlanExtensionUserTableValues,
    (planExtensionUserTableValues) => planExtensionUserTableValues.table
  )
  planExtensionUserTableValues: PlanExtensionUserTableValues[];

  @OneToMany(
    () => PlanExtensionServerTableValues,
    (planExtensionServerTableValues) => planExtensionServerTableValues.table
  )
  planExtensionServerTableValues: PlanExtensionServerTableValues[];

  @ManyToOne(
    () => PlanExtensionPlugins,
    (planExtensionPlugins) => planExtensionPlugins.planExtensionTables,
    { onDelete: "RESTRICT", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "plugin_id", referencedColumnName: "id" }])
  plugin: PlanExtensionPlugins;

  @ManyToOne(
    () => PlanExtensionIcons,
    (planExtensionIcons) => planExtensionIcons.planExtensionTables,
    { onDelete: "RESTRICT", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "icon_1_id", referencedColumnName: "id" }])
  icon_1: PlanExtensionIcons;

  @ManyToOne(
    () => PlanExtensionIcons,
    (planExtensionIcons) => planExtensionIcons.planExtensionTables2,
    { onDelete: "RESTRICT", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "icon_2_id", referencedColumnName: "id" }])
  icon_2: PlanExtensionIcons;

  @ManyToOne(
    () => PlanExtensionIcons,
    (planExtensionIcons) => planExtensionIcons.planExtensionTables3,
    { onDelete: "RESTRICT", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "icon_3_id", referencedColumnName: "id" }])
  icon_3: PlanExtensionIcons;

  @ManyToOne(
    () => PlanExtensionIcons,
    (planExtensionIcons) => planExtensionIcons.planExtensionTables4,
    { onDelete: "RESTRICT", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "icon_4_id", referencedColumnName: "id" }])
  icon_4: PlanExtensionIcons;

  @ManyToOne(
    () => PlanExtensionIcons,
    (planExtensionIcons) => planExtensionIcons.planExtensionTables5,
    { onDelete: "RESTRICT", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "icon_5_id", referencedColumnName: "id" }])
  icon_5: PlanExtensionIcons;

  @ManyToOne(
    () => PlanExtensionTabs,
    (planExtensionTabs) => planExtensionTabs.planExtensionTables,
    { onDelete: "RESTRICT", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "tab_id", referencedColumnName: "id" }])
  tab: PlanExtensionTabs;
}
