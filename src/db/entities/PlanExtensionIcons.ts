import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PlanExtensionProviders } from "./PlanExtensionProviders";
import { PlanExtensionPlugins } from "./PlanExtensionPlugins";
import { PlanExtensionTabs } from "./PlanExtensionTabs";
import { PlanExtensionTables } from "./PlanExtensionTables";

@Entity("plan_extension_icons", { schema: "customer_199616_master" })
export class PlanExtensionIcons {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", length: 50, default: () => "'question'" })
  name: string;

  @Column("varchar", { name: "family", length: 15, default: () => "'SOLID'" })
  family: string;

  @Column("varchar", { name: "color", length: 25, default: () => "'NONE'" })
  color: string;

  @OneToMany(
    () => PlanExtensionProviders,
    (planExtensionProviders) => planExtensionProviders.icon
  )
  planExtensionProviders: PlanExtensionProviders[];

  @OneToMany(
    () => PlanExtensionPlugins,
    (planExtensionPlugins) => planExtensionPlugins.icon
  )
  planExtensionPlugins: PlanExtensionPlugins[];

  @OneToMany(
    () => PlanExtensionTabs,
    (planExtensionTabs) => planExtensionTabs.icon
  )
  planExtensionTabs: PlanExtensionTabs[];

  @OneToMany(
    () => PlanExtensionTables,
    (planExtensionTables) => planExtensionTables.icon_1
  )
  planExtensionTables: PlanExtensionTables[];

  @OneToMany(
    () => PlanExtensionTables,
    (planExtensionTables) => planExtensionTables.icon_2
  )
  planExtensionTables2: PlanExtensionTables[];

  @OneToMany(
    () => PlanExtensionTables,
    (planExtensionTables) => planExtensionTables.icon_3
  )
  planExtensionTables3: PlanExtensionTables[];

  @OneToMany(
    () => PlanExtensionTables,
    (planExtensionTables) => planExtensionTables.icon_4
  )
  planExtensionTables4: PlanExtensionTables[];

  @OneToMany(
    () => PlanExtensionTables,
    (planExtensionTables) => planExtensionTables.icon_5
  )
  planExtensionTables5: PlanExtensionTables[];
}
