import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("plan_geolocations", { schema: "customer_199616_master" })
export class PlanGeolocations {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "uuid", length: 36 })
  uuid: string;

  @Column("varchar", { name: "geolocation", length: 50 })
  geolocation: string;

  @Column("bigint", { name: "last_used", default: () => "'0'" })
  lastUsed: string;
}
