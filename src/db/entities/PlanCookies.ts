import { Column, Entity } from "typeorm";

@Entity("plan_cookies", { schema: "customer_199616_master" })
export class PlanCookies {
  @Column("varchar", { name: "web_username", length: 100 })
  webUsername: string;

  @Column("bigint", { name: "expires" })
  expires: string;

  @Column("varchar", { name: "cookie", length: 64 })
  cookie: string;
}
