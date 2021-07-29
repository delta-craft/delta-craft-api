import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PlanExtensionProviders } from "./PlanExtensionProviders";
import { PlanExtensionPlugins } from "./PlanExtensionPlugins";
import { PlanExtensionIcons } from "./PlanExtensionIcons";
import { PlanExtensionTables } from "./PlanExtensionTables";

@Index("plugin_id", ["pluginId"], {})
@Index("icon_id", ["iconId"], {})
@Entity("plan_extension_tabs", { schema: "customer_199616_master" })
export class PlanExtensionTabs {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", length: 50 })
  name: string;

  @Column("varchar", {
    name: "element_order",
    length: 100,
    default: () => "'VALUES,GRAPH,TABLE'",
  })
  elementOrder: string;

  @Column("int", { name: "tab_priority" })
  tabPriority: number;

  @Column("int", { name: "plugin_id" })
  pluginId: number;

  @Column("int", { name: "icon_id" })
  iconId: number;

  @OneToMany(
    () => PlanExtensionProviders,
    (planExtensionProviders) => planExtensionProviders.tab
  )
  planExtensionProviders: PlanExtensionProviders[];

  @ManyToOne(
    () => PlanExtensionPlugins,
    (planExtensionPlugins) => planExtensionPlugins.planExtensionTabs,
    { onDelete: "RESTRICT", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "plugin_id", referencedColumnName: "id" }])
  plugin: PlanExtensionPlugins;

  @ManyToOne(
    () => PlanExtensionIcons,
    (planExtensionIcons) => planExtensionIcons.planExtensionTabs,
    { onDelete: "RESTRICT", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "icon_id", referencedColumnName: "id" }])
  icon: PlanExtensionIcons;

  @OneToMany(
    () => PlanExtensionTables,
    (planExtensionTables) => planExtensionTables.tab
  )
  planExtensionTables: PlanExtensionTables[];
}
