import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PlanExtensionPlugins } from "./PlanExtensionPlugins";
import { PlanExtensionIcons } from "./PlanExtensionIcons";
import { PlanExtensionTabs } from "./PlanExtensionTabs";
import { PlanExtensionServerValues } from "./PlanExtensionServerValues";
import { PlanExtensionUserValues } from "./PlanExtensionUserValues";
import { PlanExtensionGroups } from "./PlanExtensionGroups";

@Index("plugin_id", ["pluginId"], {})
@Index("icon_id", ["iconId"], {})
@Index("tab_id", ["tabId"], {})
@Entity("plan_extension_providers", { schema: "customer_199616_master" })
export class PlanExtensionProviders {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", length: 50 })
  name: string;

  @Column("varchar", { name: "text", length: 50 })
  text: string;

  @Column("varchar", { name: "description", nullable: true, length: 150 })
  description: string | null;

  @Column("int", { name: "priority", default: () => "'0'" })
  priority: number;

  @Column("tinyint", {
    name: "show_in_players_table",
    width: 1,
    default: () => "'0'",
  })
  showInPlayersTable: boolean;

  @Column("tinyint", { name: "groupable", width: 1, default: () => "'0'" })
  groupable: boolean;

  @Column("varchar", { name: "condition_name", nullable: true, length: 54 })
  conditionName: string | null;

  @Column("varchar", { name: "provided_condition", nullable: true, length: 50 })
  providedCondition: string | null;

  @Column("varchar", { name: "format_type", nullable: true, length: 25 })
  formatType: string | null;

  @Column("tinyint", { name: "hidden", width: 1, default: () => "'0'" })
  hidden: boolean;

  @Column("tinyint", { name: "player_name", width: 1, default: () => "'0'" })
  playerName: boolean;

  @Column("int", { name: "plugin_id" })
  pluginId: number;

  @Column("int", { name: "icon_id" })
  iconId: number;

  @Column("int", { name: "tab_id", nullable: true })
  tabId: number | null;

  @ManyToOne(
    () => PlanExtensionPlugins,
    (planExtensionPlugins) => planExtensionPlugins.planExtensionProviders,
    { onDelete: "RESTRICT", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "plugin_id", referencedColumnName: "id" }])
  plugin: PlanExtensionPlugins;

  @ManyToOne(
    () => PlanExtensionIcons,
    (planExtensionIcons) => planExtensionIcons.planExtensionProviders,
    { onDelete: "RESTRICT", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "icon_id", referencedColumnName: "id" }])
  icon: PlanExtensionIcons;

  @ManyToOne(
    () => PlanExtensionTabs,
    (planExtensionTabs) => planExtensionTabs.planExtensionProviders,
    { onDelete: "RESTRICT", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "tab_id", referencedColumnName: "id" }])
  tab: PlanExtensionTabs;

  @OneToMany(
    () => PlanExtensionServerValues,
    (planExtensionServerValues) => planExtensionServerValues.provider
  )
  planExtensionServerValues: PlanExtensionServerValues[];

  @OneToMany(
    () => PlanExtensionUserValues,
    (planExtensionUserValues) => planExtensionUserValues.provider
  )
  planExtensionUserValues: PlanExtensionUserValues[];

  @OneToMany(
    () => PlanExtensionGroups,
    (planExtensionGroups) => planExtensionGroups.provider
  )
  planExtensionGroups: PlanExtensionGroups[];
}
