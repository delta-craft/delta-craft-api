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
import { PlanExtensionIcons } from "./PlanExtensionIcons";
import { PlanExtensionTabs } from "./PlanExtensionTabs";
import { PlanExtensionTables } from "./PlanExtensionTables";

@Index("icon_id", ["iconId"], {})
@Entity("plan_extension_plugins", { schema: "customer_199616_master" })
export class PlanExtensionPlugins {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", length: 50 })
  name: string;

  @Column("bigint", { name: "last_updated" })
  lastUpdated: string;

  @Column("varchar", { name: "server_uuid", length: 36 })
  serverUuid: string;

  @Column("int", { name: "icon_id" })
  iconId: number;

  @OneToMany(
    () => PlanExtensionProviders,
    (planExtensionProviders) => planExtensionProviders.plugin
  )
  planExtensionProviders: PlanExtensionProviders[];

  @ManyToOne(
    () => PlanExtensionIcons,
    (planExtensionIcons) => planExtensionIcons.planExtensionPlugins,
    { onDelete: "RESTRICT", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "icon_id", referencedColumnName: "id" }])
  icon: PlanExtensionIcons;

  @OneToMany(
    () => PlanExtensionTabs,
    (planExtensionTabs) => planExtensionTabs.plugin
  )
  planExtensionTabs: PlanExtensionTabs[];

  @OneToMany(
    () => PlanExtensionTables,
    (planExtensionTables) => planExtensionTables.plugin
  )
  planExtensionTables: PlanExtensionTables[];
}
